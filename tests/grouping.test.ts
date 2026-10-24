import { describe, it, expect } from 'vitest';
import { normalizeCompany, normalizeRole, makeAppId, groupEmailsIntoApplications } from '../src/grouping';
import type { RawEmail, Classification } from '../src/types';

describe('normalizeCompany', () => {
  it('strips common suffixes', () => {
    expect(normalizeCompany('Tata Digital Pvt. Ltd.')).toBe('tata digital');
    expect(normalizeCompany('Infosys Technologies Limited')).toBe('infosys');
    expect(normalizeCompany('Microsoft India')).toBe('microsoft');
  });

  it('lowercases and strips punctuation', () => {
    expect(normalizeCompany("BYJU'S")).toBe('byjus');
    expect(normalizeCompany('Razorpay Solutions')).toBe('razorpay');
  });
});

describe('groupEmailsIntoApplications', () => {
  const baseEmail = (
    id: number,
    date: string,
    company: string | null,
    role: string | null,
    category: Classification['category']
  ): [RawEmail, Classification] => {
    const email: RawEmail = {
      id,
      from: 'hr@company.com',
      subject: 'Test',
      date,
      body: 'Test body',
    };
    const cls: Classification = {
      emailId: id,
      category,
      company,
      role,
      isScamSuspected: false,
      riskReasons: [],
      confidence: 'high',
    };
    return [email, cls];
  };

  it('groups emails with same company and role', () => {
    const [e1, c1] = baseEmail(1, '2026-10-10T00:00:00Z', 'Tata Digital', 'Software Engineer', 'application_acknowledgment');
    const [e2, c2] = baseEmail(2, '2026-10-18T00:00:00Z', 'Tata Digital', 'Software Engineer', 'interview_invitation');

    const apps = groupEmailsIntoApplications([e1, e2], { 1: c1, 2: c2 });
    expect(apps).toHaveLength(1);
    expect(apps[0].emails).toEqual([1, 2]);
    expect(apps[0].stage).toBe('interview');
    expect(apps[0].company).toBe('Tata Digital');
    expect(apps[0].role).toBe('Software Engineer');
  });

  it('attaches role-null email to single company app', () => {
    const [e1, c1] = baseEmail(1, '2026-10-10T00:00:00Z', 'Meesho', 'Backend Developer', 'application_acknowledgment');
    const [e2, c2] = baseEmail(2, '2026-10-12T00:00:00Z', 'Meesho', null, 'interview_invitation');

    const apps = groupEmailsIntoApplications([e1, e2], { 1: c1, 2: c2 });
    expect(apps).toHaveLength(1);
    expect(apps[0].emails).toContain(1);
    expect(apps[0].emails).toContain(2);
  });

  it('creates null-role app if multiple company apps exist', () => {
    const [e1, c1] = baseEmail(1, '2026-10-10T00:00:00Z', 'Company X', 'Role A', 'application_acknowledgment');
    const [e2, c2] = baseEmail(2, '2026-10-11T00:00:00Z', 'Company X', 'Role B', 'application_acknowledgment');
    const [e3, c3] = baseEmail(3, '2026-10-12T00:00:00Z', 'Company X', null, 'application_acknowledgment');

    const apps = groupEmailsIntoApplications([e1, e2, e3], { 1: c1, 2: c2, 3: c3 });
    // Should have 3 apps: Role A, Role B, and null role
    const nullRoleApp = apps.find(a => a.role === null);
    expect(nullRoleApp).toBeDefined();
    expect(nullRoleApp?.emails).toContain(3);
  });

  it('excludes scam emails from pipeline', () => {
    const [e1, c1] = baseEmail(1, '2026-10-10T00:00:00Z', 'Infosys', 'Consultant', 'scam');

    const apps = groupEmailsIntoApplications([e1], { 1: c1 });
    expect(apps).toHaveLength(0);
  });

  it('stage is furthest reached: rejected beats applied', () => {
    const [e1, c1] = baseEmail(1, '2026-10-10T00:00:00Z', 'Google', 'SWE', 'application_acknowledgment');
    const [e2, c2] = baseEmail(2, '2026-10-15T00:00:00Z', 'Google', 'SWE', 'rejection');

    const apps = groupEmailsIntoApplications([e1, e2], { 1: c1, 2: c2 });
    expect(apps[0].stage).toBe('rejected');
  });

  it('latest terminal stage wins when both rejection and offer exist', () => {
    const [e1, c1] = baseEmail(1, '2026-10-10T00:00:00Z', 'Startup', 'Dev', 'rejection');
    const [e2, c2] = baseEmail(2, '2026-10-15T00:00:00Z', 'Startup', 'Dev', 'offer');

    const apps = groupEmailsIntoApplications([e1, e2], { 1: c1, 2: c2 });
    expect(apps[0].stage).toBe('offer');
  });

  it('emails are sorted by date ascending', () => {
    const [e1, c1] = baseEmail(1, '2026-10-18T00:00:00Z', 'Company', 'Role', 'interview_invitation');
    const [e2, c2] = baseEmail(2, '2026-10-10T00:00:00Z', 'Company', 'Role', 'application_acknowledgment');

    const apps = groupEmailsIntoApplications([e1, e2], { 1: c1, 2: c2 });
    expect(apps[0].emails[0]).toBe(2); // Earlier date first
    expect(apps[0].emails[1]).toBe(1);
  });
});
