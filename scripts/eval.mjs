#!/usr/bin/env node
/**
 * Eval script: classifies sample-emails.json with real Gemini API
 * and compares against expected.json.
 *
 * Usage: npm run eval
 * Requires: VITE_FIREBASE_API_KEY set in .env
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Load .env manually
function loadEnv() {
  try {
    const envPath = join(rootDir, '.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  } catch {
    // .env not found, use existing env vars
  }
}

loadEnv();

const { GoogleGenerativeAI } = await import('@google/generative-ai');

const SYSTEM_INSTRUCTION = `You classify emails received by a job seeker in India. Return one JSON object per email following the schema. Categories: application_acknowledgment (employer confirms receipt of an application), interview_invitation (invites or schedules an interview or assessment), rejection (employer declines), offer (a genuine job offer from a legitimate-looking employer process), scam (suspected fraudulent job message), other. Extract company and role only if stated in the email; otherwise null. Never invent them. Set isScamSuspected=true and category=scam only when there is concrete evidence, and list each piece of evidence in riskReasons as a short, specific phrase. Strong evidence includes: requests for any upfront fee (training, registration, security deposit, kit); requests for Aadhaar, PAN, bank or card details, OTP, or passport scans before a formal process; pressure to pay or reply urgently; offers with no interview; unrealistic pay for the role; a free-mail sender address claiming to be a large company combined with other warning signs. A free-mail sender address ALONE is not sufficient evidence. Do not state that anything is definitively illegal; describe only observable signs.`;

async function classifyWithGemini(emails) {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey || apiKey === 'your_firebase_api_key_here') {
    throw new Error(
      'VITE_FIREBASE_API_KEY is not set. Please create a .env file with your Firebase API key.\n' +
      'See .env.example for the required format.'
    );
  }

  const modelId = process.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          emailId: { type: 'integer' },
          category: {
            type: 'string',
            enum: ['application_acknowledgment', 'interview_invitation', 'rejection', 'offer', 'scam', 'other'],
          },
          company: { type: 'string' },
          role: { type: 'string' },
          isScamSuspected: { type: 'boolean' },
          riskReasons: { type: 'array', items: { type: 'string' } },
          confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        required: ['emailId', 'category', 'isScamSuspected', 'riskReasons', 'confidence'],
      },
    },
  });

  const results = {};
  const CONCURRENCY = 4;

  for (let i = 0; i < emails.length; i += CONCURRENCY) {
    const chunk = emails.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map(async (email) => {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const prompt = `Classify this email (id=${email.id}):\nFrom: ${email.from}\nSubject: ${email.subject}\nDate: ${email.date}\nBody:\n${email.body}\n\nRespond with a JSON object. The emailId must be ${email.id}. If company or role cannot be determined, use an empty string.`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const parsed = JSON.parse(text);
            parsed.emailId = email.id;
            if (!parsed.company || parsed.company.trim() === '') parsed.company = null;
            if (!parsed.role || parsed.role.trim() === '') parsed.role = null;
            if (!Array.isArray(parsed.riskReasons)) parsed.riskReasons = [];
            return parsed;
          } catch (e) {
            if (attempt === 0) continue;
            return {
              emailId: email.id,
              category: 'other',
              company: null,
              role: null,
              isScamSuspected: false,
              riskReasons: [],
              confidence: 'low',
            };
          }
        }
      })
    );

    for (const cls of chunkResults) {
      results[cls.emailId] = cls;
    }

    process.stdout.write(`  Progress: ${Math.min(i + CONCURRENCY, emails.length)}/${emails.length} emails\r`);
  }

  return results;
}

async function main() {
  console.log('\n✈️  Job Hunt Autopilot – Gemini Eval Script\n');

  // Load fixtures
  const emailsPath = join(rootDir, 'public', 'sample-emails.json');
  const expectedPath = join(rootDir, 'public', 'expected.json');

  const emails = JSON.parse(readFileSync(emailsPath, 'utf-8'));
  const expected = JSON.parse(readFileSync(expectedPath, 'utf-8'));

  const modelId = process.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
  console.log(`🧠 Model: ${modelId}`);
  console.log(`📧 Classifying ${emails.length} emails...\n`);

  let results;
  try {
    results = await classifyWithGemini(emails);
  } catch (e) {
    console.error('\n❌ Classification failed:', e.message);
    process.exit(1);
  }

  console.log('\n\n📊 Results:\n');

  // Build comparison table
  const rows = [];
  let categoryMatches = 0;
  let scamMatches = 0;

  for (const exp of expected.emails) {
    const actual = results[exp.id];
    const actualCat = actual?.category ?? '(missing)';
    const actualScam = actual?.isScamSuspected || actual?.category === 'scam' ? true : false;
    const expectedScam = exp.expectedIsScam || expected.scamEmailIds.includes(exp.id);

    const categoryMatch = actualCat === exp.expectedCategory;
    const scamMatch = actualScam === expectedScam;

    if (categoryMatch) categoryMatches++;
    if (scamMatch) scamMatches++;

    rows.push({
      id: exp.id,
      expectedCat: exp.expectedCategory,
      actualCat,
      categoryMatch,
      expectedScam,
      actualScam,
      scamMatch,
      notes: exp.notes,
    });
  }

  // Print table
  const PASS = '✅';
  const FAIL = '❌';

  const pad = (s, n) => String(s).padEnd(n);
  console.log(`${pad('ID',2)} | ${pad('Expected Category', 30)} | ${pad('Actual Category', 30)} | Cat? | Scam?`);
  console.log(`${'─'.repeat(2)}-+-${'─'.repeat(30)}-+-${'─'.repeat(30)}-+------+------`);

  for (const row of rows) {
    const scamMatch = row.scamMatch ? PASS : FAIL;
    const catMatch = row.categoryMatch ? PASS : FAIL;
    console.log(`${pad(row.id,2)} | ${pad(row.expectedCat,30)} | ${pad(row.actualCat,30)} | ${catMatch}   | ${scamMatch}`);
  }

  const total = expected.emails.length;
  const catAccuracy = (categoryMatches / total * 100).toFixed(1);
  const scamAccuracy = (scamMatches / total * 100).toFixed(1);

  console.log(`\n📈 Category Accuracy: ${categoryMatches}/${total} (${catAccuracy}%)`);
  console.log(`🚨 Scam Detection Accuracy: ${scamMatches}/${total} (${scamAccuracy}%)`);

  // List mismatches
  const catMismatches = rows.filter(r => !r.categoryMatch);
  const scamMismatches = rows.filter(r => !r.scamMatch);

  if (catMismatches.length > 0) {
    console.log('\n⚠️  Category Mismatches:');
    for (const row of catMismatches) {
      console.log(`  Email ${row.id}: expected "${row.expectedCat}", got "${row.actualCat}"`);
    }
  }

  if (scamMismatches.length > 0) {
    console.log('\n⚠️  Scam Detection Mismatches:');
    for (const row of scamMismatches) {
      console.log(`  Email ${row.id}: expected isScam=${row.expectedScam}, got isScam=${row.actualScam}`);
    }
  }

  if (catMismatches.length === 0 && scamMismatches.length === 0) {
    console.log('\n🎉 All results match expected! Perfect accuracy.');
  }

  console.log('');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
