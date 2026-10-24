// Reminder logic - pure functions, no AI
// Accepts a `today` parameter for testability

import type { Application } from './types';

// Default demo reference date
export const DEFAULT_REFERENCE_DATE = '2026-10-24';

const REMINDER_DAYS = 7;

// Add N days to an ISO date string
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Compute the difference in days (today - date), positive = overdue
export function daysSince(dateStr: string, today: string): number {
  const t = new Date(today).getTime();
  const d = new Date(dateStr).getTime();
  return Math.floor((t - d) / (1000 * 60 * 60 * 24));
}

export type ReminderStatus =
  | { type: 'none' }
  | { type: 'overdue'; daysPast: number }
  | { type: 'due_soon'; daysUntil: number };

export function computeReminderDueAt(app: Application): string | null {
  if (app.stage === 'offer' || app.stage === 'rejected') return null;
  if (!app.lastEmployerResponseAt) return null;
  return addDays(app.lastEmployerResponseAt, REMINDER_DAYS);
}

export function getReminderStatus(app: Application, today: string): ReminderStatus {
  if (app.stage === 'offer' || app.stage === 'rejected') return { type: 'none' };
  if (!app.reminderDueAt) return { type: 'none' };

  const daysPast = daysSince(app.reminderDueAt, today);
  if (daysPast > 0) {
    return { type: 'overdue', daysPast };
  } else if (daysPast === 0) {
    return { type: 'overdue', daysPast: 0 };
  } else {
    return { type: 'due_soon', daysUntil: -daysPast };
  }
}

export function getReminderLabel(status: ReminderStatus): string | null {
  switch (status.type) {
    case 'none': return null;
    case 'overdue':
      if (status.daysPast === 0) return 'Follow up today (due today)';
      return `Follow up now (overdue by ${status.daysPast} day${status.daysPast === 1 ? '' : 's'})`;
    case 'due_soon':
      if (status.daysUntil === 0) return 'Follow up today';
      return `Follow up in ${status.daysUntil} day${status.daysUntil === 1 ? '' : 's'}`;
  }
}

export function applyReminders(applications: Application[], _today?: string): Application[] {
  return applications.map(app => ({
    ...app,
    reminderDueAt: computeReminderDueAt(app),
  }));
}
