#!/usr/bin/env node
/**
 * Eval script: classifies sample-emails.json with real Gemini API
 * and compares against expected.json.
 *
 * Usage: npm run eval
 * Requires: VITE_FIREBASE_* env vars set in .env
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Load env vars
dotenv.config({ path: join(rootDir, '.env') });

// We need to mock import.meta.env for the browser modules
process.env.VITE_FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY ?? '';
process.env.VITE_FIREBASE_AUTH_DOMAIN = process.env.VITE_FIREBASE_AUTH_DOMAIN ?? '';
process.env.VITE_FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID ?? '';
process.env.VITE_FIREBASE_STORAGE_BUCKET = process.env.VITE_FIREBASE_STORAGE_BUCKET ?? '';
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '';
process.env.VITE_FIREBASE_APP_ID = process.env.VITE_FIREBASE_APP_ID ?? '';
process.env.VITE_GEMINI_MODEL = process.env.VITE_GEMINI_MODEL ?? 'gemini-2.0-flash';

type RawEmail = {
  id: number;
  from: string;
  subject: string;
  date: string;
  body: string;
};

type EmailCategory = 'application_acknowledgment' | 'interview_invitation' | 'rejection' | 'offer' | 'scam' | 'other';

type Classification = {
  emailId: number;
  category: EmailCategory;
  company: string | null;
  role: string | null;
  isScamSuspected: boolean;
  riskReasons: string[];
  confidence: 'low' | 'medium' | 'high';
};

type ExpectedEmail = {
  id: number;
  expectedCategory: EmailCategory;
  expectedIsScam: boolean;
  notes: string;
};

type Expected = {
  emails: ExpectedEmail[];
  scamEmailIds: number[];
};

// Use Google AI SDK directly for node eval script
async function classifyWithGemini(emails: RawEmail[]): Promise<Record<number, Classification>> {
  const { GoogleGenerativeAI, SchemaType } = await import('@google/generative-ai');
  
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_FIREBASE_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.VITE_GEMINI_MODEL ?? 'gemini-2.0-flash',
    systemInstruction: `You classify emails received by a job seeker in India. Return one JSON object per email following the schema. Categories: application_acknowledgment (employer confirms receipt of an application), interview_invitation (invites or schedules an interview or assessment), rejection (employer declines), offer (a genuine job offer from a legitimate-looking employer process), scam (suspected fraudulent job message), other. Extract company and role only if stated in the email; otherwise null. Never invent them. Set isScamSuspected=true and category=scam only when there is concrete evidence, and list each piece of evidence in riskReasons as a short, specific phrase. Strong evidence includes: requests for any upfront fee (training, registration, security deposit, kit); requests for Aadhaar, PAN, bank or card details, OTP, or passport scans before a formal process; pressure to pay or reply urgently; offers with no interview; unrealistic pay for the role; a free-mail sender address claiming to be a large company combined with other warning signs. A free-mail sender address ALONE is not sufficient evidence. Do not state that anything is definitively illegal; describe only observable signs.`,
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          emailId: { type: SchemaType.INTEGER },
          category: {
            type: SchemaType.STRING,
            format: 'enum',
            enum: ['application_acknowledgment', 'interview_invitation', 'rejection', 'offer', 'scam', 'other'],
          },
          company: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING },
          isScamSuspected: { type: SchemaType.BOOLEAN },
          riskReasons: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          confidence: { type: SchemaType.STRING, format: 'enum', enum: ['low', 'medium', 'high'] },
        },
        required: ['emailId', 'category', 'isScamSuspected', 'riskReasons', 'confidence'],
      },
    },
  });

  const results: Record<number, Classification> = {};
  const CONCURRENCY = 4;

  for (let i = 0; i < emails.length; i += CONCURRENCY) {
    const chunk = emails.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map(async (email) => {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const prompt = `Classify this email (id=${email.id}):\nFrom: ${email.from}\nSubject: ${email.subject}\nDate: ${email.date}\nBody:\n${email.body}\n\nRespond with a JSON object. The emailId must be ${email.id}. If company or role cannot be determined, use null.`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const parsed = JSON.parse(text) as Classification;
            parsed.emailId = email.id;
            if ((parsed.company as string | undefined) === '') parsed.company = null;
            if ((parsed.role as string | undefined) === '') parsed.role = null;
            if (!Array.isArray(parsed.riskReasons)) parsed.riskReasons = [];
            return parsed;
          } catch (e) {
            if (attempt === 0) continue;
            return {
              emailId: email.id,
              category: 'other' as EmailCategory,
              company: null,
              role: null,
              isScamSuspected: false,
              riskReasons: [],
              confidence: 'low' as const,
            };
          }
        }
        return {
          emailId: email.id,
          category: 'other' as EmailCategory,
          company: null,
          role: null,
          isScamSuspected: false,
          riskReasons: [],
          confidence: 'low' as const,
        };
      })
    );

    for (const cls of chunkResults) {
      results[cls.emailId] = cls;
    }

    process.stdout.write(`  Progress: ${Math.min(i + CONCURRENCY, emails.length)}/${emails.length}\r`);
  }

  return results;
}

async function main() {
  console.log('\n🔍 Job Hunt Autopilot – Eval Script\n');

  // Load fixtures
  const emailsPath = join(rootDir, 'public', 'sample-emails.json');
  const expectedPath = join(rootDir, 'public', 'expected.json');

  const emails: RawEmail[] = JSON.parse(readFileSync(emailsPath, 'utf-8'));
  const expected: Expected = JSON.parse(readFileSync(expectedPath, 'utf-8'));

  console.log(`📧 Classifying ${emails.length} emails with Gemini...`);

  let results: Record<number, Classification>;
  try {
    results = await classifyWithGemini(emails);
  } catch (e) {
    console.error('\n❌ Classification failed:', e);
    process.exit(1);
  }

  console.log('\n\n📊 Results:\n');

  // Build comparison table
  const rows: Array<{
    id: number;
    expectedCat: string;
    actualCat: string;
    categoryMatch: boolean;
    expectedScam: boolean;
    actualScam: boolean;
    scamMatch: boolean;
    notes: string;
  }> = [];

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

  console.log('ID | Expected Category          | Actual Category            | Cat? | Scam? |');
  console.log('---|---------------------------|---------------------------|------|-------|');

  for (const row of rows) {
    const id = String(row.id).padEnd(2);
    const exp = row.expectedCat.padEnd(27);
    const act = row.actualCat.padEnd(27);
    const catIcon = row.categoryMatch ? PASS : FAIL;
    const scamIcon = row.scamMatch ? PASS : FAIL;
    console.log(`${id} | ${exp} | ${act} | ${catIcon}   | ${scamIcon}    |`);
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
      console.log(`    Notes: ${row.notes}`);
    }
  }

  if (scamMismatches.length > 0) {
    console.log('\n⚠️  Scam Detection Mismatches:');
    for (const row of scamMismatches) {
      console.log(`  Email ${row.id}: expected scam=${row.expectedScam}, got scam=${row.actualScam}`);
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
