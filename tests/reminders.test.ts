import { describe, it, expect } from 'vitest';
import { getReminderStatus, getReminderLabel, computeReminderDueAt, addDays } from '../src/reminders';
import type { Application } from '../src/types';

function makeApp(overrides: Partial<Application>): Application {
  return {
    id: 'test-app',
    company: 'Test Co',
    role: 'Engineer',
    stage: 'applied',
    emails: [1],
    lastEmployerResponseAt: '2026-10-10T00:00:00.000Z',
    reminderDueAt: null,
    ...overrides,
  };
}

describe('addDays', () => {
  it('adds 7 days correctly', () => {
    expect(addDays('2026-10-10', 7)).toBe('2026-10-17');
  });

  it('handles month boundary', () => {
    expect(addDays('2026-10-28', 7)).toBe('2026-11-04');
  });
});

describe('computeReminderDueAt', () => {
  it('computes 7 days after last response for applied stage', () => {
    const app = makeApp({ stage: 'applied', lastEmployerResponseAt: '2026-10-10T00:00:00.000Z' });
    expect(computeReminderDueAt(app)).toBe('2026-10-17');
  });

  it('computes 7 days after last response for interview stage', () => {
    const app = makeApp({ stage: 'interview', lastEmployerResponseAt: '2026-10-18T00:00:00.000Z' });
    expect(computeReminderDueAt(app)).toBe('2026-10-25');
  });

  it('returns null for offer stage', () => {
    const app = makeApp({ stage: 'offer' });
    expect(computeReminderDueAt(app)).toBeNull();
  });

  it('returns null for rejected stage', () => {
    const app = makeApp({ stage: 'rejected' });
    expect(computeReminderDueAt(app)).toBeNull();
  });
});

describe('getReminderStatus', () => {
  it('shows overdue when today is 8 days after last response', () => {
    const app = makeApp({
      stage: 'applied',
      lastEmployerResponseAt: '2026-10-10T00:00:00.000Z',
      reminderDueAt: '2026-10-17',
    });
    const status = getReminderStatus(app, '2026-10-24');
    expect(status.type).toBe('overdue');
    if (status.type === 'overdue') {
      expect(status.daysPast).toBe(7);
    }
  });

  it('shows due_soon when today is 6 days after last response (1 day before due)', () => {
    const app = makeApp({
      stage: 'applied',
      lastEmployerResponseAt: '2026-10-10T00:00:00.000Z',
      reminderDueAt: '2026-10-17',
    });
    const status = getReminderStatus(app, '2026-10-16');
    expect(status.type).toBe('due_soon');
    if (status.type === 'due_soon') {
      expect(status.daysUntil).toBe(1);
    }
  });

  it('shows overdue on exactly the due date (today === dueDate)', () => {
    const app = makeApp({
      stage: 'applied',
      lastEmployerResponseAt: '2026-10-10T00:00:00.000Z',
      reminderDueAt: '2026-10-17',
    });
    const status = getReminderStatus(app, '2026-10-17');
    expect(status.type).toBe('overdue');
    if (status.type === 'overdue') {
      expect(status.daysPast).toBe(0);
    }
  });

  it('later employer email resets the reminder clock', () => {
    // Acknowledgment on Oct 10, then interview invitation on Oct 18
    // Clock should be based on Oct 18 (reminderDueAt = Oct 25)
    const app = makeApp({
      stage: 'interview',
      lastEmployerResponseAt: '2026-10-18T11:30:00.000Z',
      reminderDueAt: '2026-10-25',
    });
    // On Oct 24, reminder is due tomorrow — not overdue
    const status = getReminderStatus(app, '2026-10-24');
    expect(status.type).toBe('due_soon');
    if (status.type === 'due_soon') {
      expect(status.daysUntil).toBe(1);
    }
  });

  it('no reminder for terminal stage offer', () => {
    const app = makeApp({ stage: 'offer', reminderDueAt: null });
    expect(getReminderStatus(app, '2026-10-24').type).toBe('none');
  });

  it('no reminder for terminal stage rejected', () => {
    const app = makeApp({ stage: 'rejected', reminderDueAt: null });
    expect(getReminderStatus(app, '2026-10-24').type).toBe('none');
  });
});

describe('getReminderLabel', () => {
  it('returns overdue label with days', () => {
    const label = getReminderLabel({ type: 'overdue', daysPast: 3 });
    expect(label).toContain('overdue');
    expect(label).toContain('3');
  });

  it('returns follow up today for overdue 0 days', () => {
    const label = getReminderLabel({ type: 'overdue', daysPast: 0 });
    expect(label?.toLowerCase()).toContain('today');
  });

  it('returns due soon label', () => {
    const label = getReminderLabel({ type: 'due_soon', daysUntil: 5 });
    expect(label).toContain('5');
  });

  it('returns null for no reminder', () => {
    expect(getReminderLabel({ type: 'none' })).toBeNull();
  });
});

describe('Acceptance criteria: Tata Digital vs Wipro', () => {
  it('Tata Digital (10 Oct + 18 Oct) is NOT overdue on 24 Oct', () => {
    // Interview invitation on Oct 18 resets clock → reminderDueAt Oct 25
    const app = makeApp({
      stage: 'interview',
      lastEmployerResponseAt: '2026-10-18T11:30:00.000Z',
      reminderDueAt: '2026-10-25',
    });
    const status = getReminderStatus(app, '2026-10-24');
    expect(status.type).not.toBe('overdue');
  });

  it('Wipro (10 Oct only) IS overdue on 24 Oct', () => {
    const app = makeApp({
      stage: 'applied',
      lastEmployerResponseAt: '2026-10-10T10:00:00.000Z',
      reminderDueAt: '2026-10-17',
    });
    const status = getReminderStatus(app, '2026-10-24');
    expect(status.type).toBe('overdue');
  });
});
