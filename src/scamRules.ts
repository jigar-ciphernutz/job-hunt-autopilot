// Deterministic scam cross-check rules - independent of Gemini
// Run regex/keyword rules on each email and return hits as strings

import type { RawEmail } from './types';

// Fee/payment request patterns
const FEE_PATTERNS = [
  /(₹|rs\.?|inr)\s?[\d,]+.{0,40}(fee|deposit|charges|kit|training|registration)/i,
  /(fee|deposit|charges|training|registration|kit).{0,40}(₹|rs\.?|inr)\s?[\d,]+/i,
  /pay\s+(a|the|rs\.?|inr|₹)?\s*(fee|deposit|amount|charges)/i,
  /joining\s+kit/i,
  /registration\s+(fee|charges|amount)/i,
  /training\s+(fee|charges|amount|cost)/i,
  /security\s+deposit/i,
  /refundable\s+deposit/i,
];

// Sensitive identifier patterns
const SENSITIVE_ID_PATTERNS = [
  /\baadhaar\b/i,
  /\bpan\s*(card|number|details|no)?\b/i,
  /\bbank\s+account\b/i,
  /\baccount\s+number\b/i,
  /\bifsc\b/i,
  /\botp\b/i,
  /\bpassport\s*(scan|copy|details|number)?\b/i,
  /\bvisa\s+copy\b/i,
];

// Urgency + payment language
const URGENCY_PATTERNS = [
  /urgent(ly)?\s+(pay|transfer|send|deposit)/i,
  /(pay|transfer|send|deposit).{0,30}(immediately|urgently|asap|within\s*24\s*hours|today)/i,
  /limited\s+(time|slots?)\s+offer/i,
  /act\s+now/i,
  /respond\s+(immediately|urgently|asap|within\s*24)/i,
  /confirm\s+(within|by)\s+\d+\s*hours/i,
];

// No interview / direct offer patterns
const NO_INTERVIEW_PATTERNS = [
  /without\s+(interview|test|assessment)/i,
  /no\s+(interview|test|assessment)\s+required/i,
  /direct\s+(hiring|appointment|joining)/i,
  /selected\s+without\s+interview/i,
];

export interface RuleHitResult {
  hits: string[];
}

export function checkScamRules(email: RawEmail): RuleHitResult {
  const text = `${email.subject} ${email.body}`;
  const hits: string[] = [];

  for (const pattern of FEE_PATTERNS) {
    if (pattern.test(text)) {
      hits.push('Requests payment or fee (registration, training, kit, or deposit)');
      break; // One hit is enough for this category
    }
  }

  const sensitiveFound: string[] = [];
  for (const pattern of SENSITIVE_ID_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const matched = match[0].toLowerCase();
      if (matched.includes('aadhaar')) sensitiveFound.push('Aadhaar');
      else if (matched.includes('pan')) sensitiveFound.push('PAN card');
      else if (matched.includes('bank') || matched.includes('account') || matched.includes('ifsc')) sensitiveFound.push('Bank account details');
      else if (matched.includes('otp')) sensitiveFound.push('OTP');
      else if (matched.includes('passport')) sensitiveFound.push('Passport scan/copy');
      else if (matched.includes('visa')) sensitiveFound.push('Visa copy');
    }
  }
  if (sensitiveFound.length > 0) {
    hits.push(`Requests sensitive identifiers: ${[...new Set(sensitiveFound)].join(', ')}`);
  }

  for (const pattern of URGENCY_PATTERNS) {
    if (pattern.test(text)) {
      hits.push('Uses urgency language combined with payment pressure');
      break;
    }
  }

  for (const pattern of NO_INTERVIEW_PATTERNS) {
    if (pattern.test(text)) {
      hits.push('Claims to offer job without an interview or assessment');
      break;
    }
  }

  return { hits };
}

export function isFreeMailSender(from: string): boolean {
  return /\b(gmail|yahoo|hotmail|outlook|rediffmail|ymail|live|aol|protonmail)\.(com|in|co\.in)\b/i.test(from);
}
