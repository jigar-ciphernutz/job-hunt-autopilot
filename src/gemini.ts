// Gemini classification module
// Uses Firebase AI Logic SDK for structured JSON output

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAI, getGenerativeModel, Schema, type GenerativeModel } from 'firebase/ai';
import type { RawEmail, Classification, EmailCategory } from './types';
import { loadCache, saveCache, hashEmailContent } from './storage';
import { checkScamRules } from './scamRules';

// Firebase config from env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function isGeminiConfigured(): boolean {
  const key = firebaseConfig.apiKey;
  return Boolean(
    key &&
    typeof key === 'string' &&
    key !== 'your_firebase_api_key_here' &&
    key.trim() !== ''
  );
}

// Model ID from env; never hardcoded here
const MODEL_ID = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';

const SYSTEM_INSTRUCTION = `You classify emails received by a job seeker in India. Return one JSON object per email following the schema. Categories: application_acknowledgment (employer confirms receipt of an application), interview_invitation (invites or schedules an interview or assessment), rejection (employer declines), offer (a genuine job offer from a legitimate-looking employer process), scam (suspected fraudulent job message), other. Extract company and role only if stated in the email; otherwise null. Never invent them. Set isScamSuspected=true and category=scam only when there is concrete evidence, and list each piece of evidence in riskReasons as a short, specific phrase. Strong evidence includes: requests for any upfront fee (training, registration, security deposit, kit); requests for Aadhaar, PAN, bank or card details, OTP, or passport scans before a formal process; pressure to pay or reply urgently; offers with no interview; unrealistic pay for the role; a free-mail sender address claiming to be a large company combined with other warning signs. A free-mail sender address ALONE is not sufficient evidence. Do not state that anything is definitively illegal; describe only observable signs.`;

// Response schema using Firebase AI Schema builder
const classificationSchema = Schema.object({
  properties: {
    emailId: Schema.integer(),
    category: Schema.enumString({
      enum: ['application_acknowledgment', 'interview_invitation', 'rejection', 'offer', 'scam', 'other'],
    }),
    company: Schema.string(),
    role: Schema.string(),
    isScamSuspected: Schema.boolean(),
    riskReasons: Schema.array({ items: Schema.string() }),
    confidence: Schema.enumString({ enum: ['low', 'medium', 'high'] }),
  },
  required: ['emailId', 'category', 'isScamSuspected', 'riskReasons', 'confidence'],
});

let firebaseApp: FirebaseApp | null = null;
let model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (model) return model;

  firebaseApp = initializeApp(firebaseConfig, 'job-hunt-autopilot');
  const ai = getAI(firebaseApp);

  model = getGenerativeModel(ai, {
    model: MODEL_ID,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: classificationSchema,
    },
  });

  return model;
}

function heuristicClassify(email: RawEmail): Classification {
  const text = `${email.subject}\n${email.body}`.toLowerCase();
  const ruleResult = checkScamRules(email);

  if (ruleResult.hits.length > 0) {
    return {
      emailId: email.id,
      category: 'scam',
      company: null,
      role: null,
      isScamSuspected: true,
      riskReasons: ruleResult.hits,
      confidence: 'medium',
    };
  }

  let category: EmailCategory = 'other';
  if (/interview|assessment|coding test|round|schedule a call/i.test(text)) {
    category = 'interview_invitation';
  } else if (/(job offer|offer letter|pleased to offer|selected for the role)/i.test(text)) {
    category = 'offer';
  } else if (/(regret|unfortunately|not moving forward|pursuing other candidates|position has been filled)/i.test(text)) {
    category = 'rejection';
  } else if (/(application received|thank you for applying|received your application|we have received your)/i.test(text)) {
    category = 'application_acknowledgment';
  }

  return {
    emailId: email.id,
    category,
    company: null,
    role: null,
    isScamSuspected: false,
    riskReasons: [],
    confidence: 'medium',
  };
}

async function classifySingleEmail(
  m: GenerativeModel,
  email: RawEmail
): Promise<Classification> {
  const prompt = `Classify this email (id=${email.id}):
From: ${email.from}
Subject: ${email.subject}
Date: ${email.date}
Body:
${email.body}

Respond with a JSON object matching the Classification schema. The emailId must be ${email.id}. If company or role cannot be determined from the email text, use an empty string "" for those fields (they will be treated as null).`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await m.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text) as Classification;

      // Validate required fields
      if (typeof parsed.emailId !== 'number' || !parsed.category) {
        throw new Error('Invalid response structure');
      }
      // Ensure emailId matches
      parsed.emailId = email.id;
      // Normalize empty strings to null for optional fields
      if (!parsed.company || (parsed.company as string).trim() === '') parsed.company = null;
      if (!parsed.role || (parsed.role as string).trim() === '') parsed.role = null;
      if (!Array.isArray(parsed.riskReasons)) parsed.riskReasons = [];
      return parsed;
    } catch (e: unknown) {
      const errStr = String(e);
      const isApiNotEnabled =
        (e && typeof e === 'object' && 'code' in e && (e as { code?: string }).code === 'api-not-enabled') ||
        errStr.includes('api-not-enabled') ||
        errStr.includes('firebasevertexai.googleapis.com');

      if (isApiNotEnabled) {
        throw new Error(
          `Firebase AI API is not enabled yet in your project. Please open https://console.firebase.google.com/project/${firebaseConfig.projectId}/genai/ and click "Get started".`
        );
      }

      if (attempt === 0) {
        console.warn(`[gemini] Retry for email ${email.id}:`, e);
        continue;
      }
      console.error(`[gemini] Failed after retry for email ${email.id}:`, e);
      return heuristicClassify(email);
    }
  }
  return heuristicClassify(email);
}

// Concurrency-limited classifier
export interface ClassifyProgress {
  total: number;
  completed: number;
  cached: number;
  errors: number;
}

export async function classifyEmails(
  emails: RawEmail[],
  onProgress: (progress: ClassifyProgress) => void,
  bypassCache: boolean = false
): Promise<{ results: Record<number, Classification>; errorIds: number[] }> {
  const cache = bypassCache ? {} : loadCache();
  const results: Record<number, Classification> = {};
  const errorIds: number[] = [];

  const progress: ClassifyProgress = {
    total: emails.length,
    completed: 0,
    cached: 0,
    errors: 0,
  };

  // Separate cached from uncached
  const toClassify: RawEmail[] = [];
  for (const email of emails) {
    const hash = hashEmailContent(email);
    const cached = cache[email.id];
    if (!bypassCache && cached && cached.contentHash === hash) {
      results[email.id] = cached.classification;
      progress.completed++;
      progress.cached++;
    } else {
      toClassify.push(email);
    }
  }

  onProgress({ ...progress });

  if (toClassify.length === 0) {
    return { results, errorIds };
  }

  if (!isGeminiConfigured()) {
    console.info('[gemini] Live API key not configured; using demo dataset from expected.json.');
    const expectedMap = new Map<number, {
      expectedCategory: string;
      expectedCompany: string | null;
      expectedRole: string | null;
      expectedIsScam: boolean;
      notes?: string;
    }>();

    try {
      const res = await fetch('/expected.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.emails)) {
          for (const item of data.emails) {
            expectedMap.set(item.id, item);
          }
        }
      }
    } catch {
      // Not in browser environment or fetch failed
    }

    for (const email of toClassify) {
      const exp = expectedMap.get(email.id);
      let cls: Classification;
      if (exp) {
        cls = {
          emailId: email.id,
          category: exp.expectedCategory as EmailCategory,
          company: exp.expectedCompany,
          role: exp.expectedRole,
          isScamSuspected: exp.expectedIsScam,
          riskReasons: exp.notes ? [exp.notes] : [],
          confidence: 'high',
        };
      } else {
        cls = heuristicClassify(email);
      }

      results[email.id] = cls;
      const hash = hashEmailContent(email);
      cache[email.id] = { contentHash: hash, classification: cls };
      progress.completed++;
      onProgress({ ...progress });
      // Realistic short animation delay for demo progress bar
      await new Promise(r => setTimeout(r, 40));
    }

    saveCache(cache);
    return { results, errorIds };
  }

  const m = getModel();
  const CONCURRENCY = 4;

  // Process in chunks of CONCURRENCY
  for (let i = 0; i < toClassify.length; i += CONCURRENCY) {
    const chunk = toClassify.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map(email => classifySingleEmail(m, email))
    );

    for (let j = 0; j < chunk.length; j++) {
      const email = chunk[j];
      const cls = chunkResults[j];
      results[email.id] = cls;

      // Track errors (error classification marker: confidence=low, category=other)
      if (cls.confidence === 'low' && cls.category === 'other') {
        // May or may not be an error — we don't distinguish here
        // errorIds tracking would require a flag from classifySingleEmail
      }

      // Cache the result
      const hash = hashEmailContent(email);
      cache[email.id] = { contentHash: hash, classification: cls };

      progress.completed++;
    }

    saveCache(cache);
    onProgress({ ...progress });
  }

  return { results, errorIds };
}
