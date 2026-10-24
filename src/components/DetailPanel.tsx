import { useState } from 'react';
import type { Application, RawEmail, Classification, EmailCategory } from '../types';
import { getReminderStatus, getReminderLabel } from '../reminders';

interface DetailPanelProps {
  app: Application;
  emails: RawEmail[];
  classifications: Record<number, Classification>;
  today: string;
  onClose: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function CategoryChip({ category, isError }: { category: EmailCategory | 'error'; isError?: boolean }) {
  const labels: Record<string, string> = {
    application_acknowledgment: 'Acknowledged',
    interview_invitation: 'Interview',
    rejection: 'Rejected',
    offer: 'Offer',
    scam: 'Scam ⚠',
    other: 'Other',
    error: 'Error',
  };

  const classMap: Record<string, string> = {
    application_acknowledgment: 'chip-acknowledgment',
    interview_invitation: 'chip-interview',
    rejection: 'chip-rejection',
    offer: 'chip-offer',
    scam: 'chip-scam',
    other: 'chip-other',
    error: 'chip-error',
  };

  const key = isError ? 'error' : category;

  return (
    <span className={`chip ${classMap[key] ?? 'chip-other'}`}>
      {labels[key] ?? key}
    </span>
  );
}

function dotClass(category: EmailCategory): string {
  const map: Record<EmailCategory, string> = {
    application_acknowledgment: 'dot-acknowledgment',
    interview_invitation: 'dot-interview',
    rejection: 'dot-rejection',
    offer: 'dot-offer',
    scam: 'dot-scam',
    other: 'dot-other',
  };
  return map[category] ?? 'dot-other';
}

function TimelineEntry({
  email,
  cls,
  isError,
}: {
  email: RawEmail;
  cls: Classification | undefined;
  isError: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const category = cls?.category ?? 'other';

  return (
    <div className="timeline-item">
      <div className="timeline-dot-wrap">
        <div className={`timeline-dot ${isError ? 'dot-other' : dotClass(category)}`} />
      </div>
      <div className="timeline-content">
        <div className="timeline-meta">
          <span className="timeline-date">{formatDate(email.date)}</span>
          <CategoryChip category={category} isError={isError} />
        </div>
        <div className="timeline-subject">{email.subject}</div>
        <div className="timeline-from">From: {email.from}</div>
        {expanded ? (
          <>
            <div className="timeline-body">{email.body}</div>
            <button className="expand-btn" onClick={() => setExpanded(false)}>
              ▲ Collapse
            </button>
          </>
        ) : (
          <button className="expand-btn" onClick={() => setExpanded(true)}>
            ▼ Show email body
          </button>
        )}
      </div>
    </div>
  );
}

export function DetailPanel({ app, emails, classifications, today, onClose }: DetailPanelProps) {
  const reminderStatus = getReminderStatus(app, today);
  const reminderLabel = getReminderLabel(reminderStatus);

  const stageClass: Record<Application['stage'], string> = {
    applied: 'stage-badge-applied',
    interview: 'stage-badge-interview',
    offer: 'stage-badge-offer',
    rejected: 'stage-badge-rejected',
  };

  const stageLabel: Record<Application['stage'], string> = {
    applied: '📋 Applied',
    interview: '💬 Interview',
    offer: '🎉 Offer',
    rejected: '❌ Rejected',
  };

  const appEmails = app.emails
    .map(id => emails.find(e => e.id === id))
    .filter((e): e is RawEmail => Boolean(e));

  return (
    <div className="detail-panel" role="dialog" aria-label={`${app.company} application details`}>
      <div className="detail-header">
        <div>
          <div className="detail-company">{app.company}</div>
          <div className="detail-role">{app.role ?? 'Role not specified'}</div>
        </div>
        <button
          className="detail-close"
          onClick={onClose}
          aria-label="Close detail panel"
        >
          ✕
        </button>
      </div>

      <div className={`detail-stage-badge ${stageClass[app.stage]}`}>
        {stageLabel[app.stage]}
      </div>

      {reminderLabel && (
        <div className={`reminder-badge ${reminderStatus.type === 'overdue' ? 'overdue' : 'due-soon'}`} style={{ width: 'auto', display: 'inline-flex', marginBottom: 16 }}>
          <span>{reminderStatus.type === 'overdue' ? '⏰' : '🔔'}</span>
          <span>{reminderLabel}</span>
        </div>
      )}

      <div className="divider" />

      <div className="detail-timeline-title">Email Timeline</div>

      <div className="timeline">
        {appEmails.map(email => (
          <TimelineEntry
            key={email.id}
            email={email}
            cls={classifications[email.id]}
            isError={false}
          />
        ))}
      </div>
    </div>
  );
}
