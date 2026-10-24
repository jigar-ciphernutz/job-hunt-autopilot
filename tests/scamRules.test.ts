import { describe, it, expect } from 'vitest';
import { checkScamRules } from '../src/scamRules';
import type { RawEmail } from '../src/types';

function makeEmail(from: string, subject: string, body: string): RawEmail {
  return { id: 1, from, subject, date: '2026-10-10T00:00:00Z', body };
}

describe('checkScamRules', () => {
  it('detects fee request with ₹ symbol', () => {
    const email = makeEmail(
      'hr@fake.com',
      'Job Offer',
      'Please pay a training fee of ₹4,999 to confirm your joining.'
    );
    const result = checkScamRules(email);
    expect(result.hits.length).toBeGreaterThan(0);
    expect(result.hits.some(h => h.toLowerCase().includes('payment') || h.toLowerCase().includes('fee'))).toBe(true);
  });

  it('detects Aadhaar request', () => {
    const email = makeEmail(
      'hr@fake.com',
      'Joining Formalities',
      'Please send your Aadhaar card copy to complete background verification.'
    );
    const result = checkScamRules(email);
    expect(result.hits.length).toBeGreaterThan(0);
    expect(result.hits.some(h => h.includes('Aadhaar'))).toBe(true);
  });

  it('detects PAN card request', () => {
    const email = makeEmail(
      'hr@fake.com',
      'Document Collection',
      'Share your PAN card details for KYC verification.'
    );
    const result = checkScamRules(email);
    expect(result.hits.some(h => h.includes('PAN'))).toBe(true);
  });

  it('detects OTP request', () => {
    const email = makeEmail(
      'hr@fake.com',
      'Registration',
      'Send OTP to our HR to register your account.'
    );
    const result = checkScamRules(email);
    expect(result.hits.some(h => h.includes('OTP'))).toBe(true);
  });

  it('detects joining kit (avoids the word fee)', () => {
    const email = makeEmail(
      'hr@fake.com',
      'Work Kit',
      'To receive your work materials, please buy a Joining Kit for Rs. 1,500.'
    );
    const result = checkScamRules(email);
    expect(result.hits.length).toBeGreaterThan(0);
  });

  it('detects bank account request', () => {
    const email = makeEmail(
      'hr@fake.com',
      'Salary Setup',
      'Please share your bank account number and IFSC code for salary processing.'
    );
    const result = checkScamRules(email);
    expect(result.hits.some(h => h.toLowerCase().includes('bank'))).toBe(true);
  });

  it('does NOT flag a legitimate recruiter email', () => {
    const email = makeEmail(
      'priya.sharma.recruiter@gmail.com',
      'Backend Developer role at FinEdge Capital',
      'Hi, I am a recruiter at FinEdge Capital. We have a Backend Developer opening that matches your profile. CTC range is 18-24 LPA. Would you be interested in a call?'
    );
    const result = checkScamRules(email);
    expect(result.hits.length).toBe(0);
  });

  it('does NOT flag a genuine offer letter', () => {
    const email = makeEmail(
      'hr@zomato.com',
      'Offer Letter – Product Manager',
      'We are thrilled to extend a formal offer for the position of Product Manager at Zomato. CTC: ₹28,00,000 per annum. Please sign the offer letter via DocuSign.'
    );
    const result = checkScamRules(email);
    expect(result.hits.length).toBe(0);
  });

  it('detects registration fee', () => {
    const email = makeEmail(
      'fake@jobs.info',
      'Urgent Hiring',
      'Pay a nominal processing fee of Rs. 299 to activate your profile.'
    );
    const result = checkScamRules(email);
    expect(result.hits.length).toBeGreaterThan(0);
  });

  it('detects urgency combined with payment', () => {
    const email = makeEmail(
      'fake@jobs.com',
      'Offer',
      'Pay the registration amount immediately to secure your position.'
    );
    const result = checkScamRules(email);
    expect(result.hits.length).toBeGreaterThan(0);
  });
});
