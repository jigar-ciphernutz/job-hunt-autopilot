import type { Application } from '../types';
import { getReminderStatus, getReminderLabel } from '../reminders';

interface ApplicationCardProps {
  app: Application;
  today: string;
  selected: boolean;
  onClick: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function ApplicationCard({ app, today, selected, onClick }: ApplicationCardProps) {
  const reminderStatus = getReminderStatus(app, today);
  const reminderLabel = getReminderLabel(reminderStatus);

  return (
    <div
      className={`app-card${selected ? ' selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-selected={selected}
      aria-label={`${app.company} – ${app.role ?? 'Role not specified'}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="app-card-company" title={app.company}>{app.company}</div>
      <div className="app-card-role" title={app.role ?? 'Role not specified'}>
        {app.role ?? <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Role not specified</span>}
      </div>
      <div className="app-card-meta">
        <span>Last: {formatDate(app.lastEmployerResponseAt)}</span>
        <span>{app.emails.length} email{app.emails.length !== 1 ? 's' : ''}</span>
      </div>
      {reminderLabel && (
        <div className={`reminder-badge ${reminderStatus.type === 'overdue' ? 'overdue' : 'due-soon'}`}>
          <span>{reminderStatus.type === 'overdue' ? '⏰' : '🔔'}</span>
          <span>{reminderLabel}</span>
        </div>
      )}
    </div>
  );
}
