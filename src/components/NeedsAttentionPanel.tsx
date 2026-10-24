import type { Application, RawEmail, ScamFlag } from '../types';
import { getReminderStatus, getReminderLabel } from '../reminders';

interface NeedsAttentionPanelProps {
  applications: Application[];
  emails: RawEmail[];
  scamFlags: ScamFlag[];
  today: string;
  onSelectApp: (appId: string) => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return iso;
  }
}

function ScamCard({ flag, email }: { flag: ScamFlag; email: RawEmail | undefined }) {
  const allEvidence = [...new Set([...flag.geminiReasons, ...flag.ruleHits])];

  return (
    <div className={`scam-card ${flag.severity === 'likely' ? 'likely' : 'needs-review'}`}>
      <div className="scam-card-header">
        <div className={`scam-severity-badge ${flag.severity === 'likely' ? 'likely' : 'needs-review'}`}>
          {flag.severity === 'likely' ? '🔴 Likely Scam' : '🟡 Needs Review'}
        </div>
      </div>

      <div className="scam-card-info">
        <div className="scam-sender">From: {email?.from ?? `Email #${flag.emailId}`}</div>
        <div className="scam-subject">{email?.subject ?? '(no subject)'}</div>
      </div>

      {allEvidence.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="scam-evidence-title">Warning signs observed</div>
          <ul className="scam-evidence-list">
            {allEvidence.map((reason, i) => (
              <li key={i} className="scam-evidence-item">{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="scam-disclaimer">
        These are warning signs, not a verdict. Use your judgment before taking any action.
      </div>
    </div>
  );
}

export function NeedsAttentionPanel({
  applications,
  emails,
  scamFlags,
  today,
  onSelectApp,
}: NeedsAttentionPanelProps) {
  // Overdue applications
  const overdueApps = applications.filter(app => {
    const status = getReminderStatus(app, today);
    return status.type === 'overdue';
  });

  const likelyScams = scamFlags.filter(f => f.severity === 'likely');
  const needsReview = scamFlags.filter(f => f.severity === 'needs_review');

  const hasAnything = overdueApps.length > 0 || scamFlags.length > 0;

  if (!hasAnything) {
    return (
      <div>
        <div className="panel-section-title">Needs Attention</div>
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div>All clear – nothing needs attention</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {overdueApps.length > 0 && (
        <div>
          <div className="panel-section-title">
            ⏰ Overdue Follow-ups
            <span className="count-badge" style={{ background: 'var(--color-warning)', color: '#000' }}>
              {overdueApps.length}
            </span>
          </div>
          {overdueApps.map(app => {
            const status = getReminderStatus(app, today);
            const label = getReminderLabel(status);
            return (
              <div
                key={app.id}
                className="overdue-card"
                onClick={() => onSelectApp(app.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectApp(app.id)}
              >
                <div className="overdue-card-header">
                  <div>
                    <div className="overdue-company">{app.company}</div>
                    <div className="overdue-role">{app.role ?? 'Role not specified'}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {formatDate(app.lastEmployerResponseAt)}
                  </div>
                </div>
                {label && (
                  <div className="reminder-badge overdue">
                    <span>⏰</span>
                    <span>{label}</span>
                  </div>
                )}
              </div>
            );
          })}
          <div className="divider" />
        </div>
      )}

      {scamFlags.length > 0 && (
        <div>
          <div className="panel-section-title">
            ⚠️ Suspicious Emails
            {likelyScams.length > 0 && (
              <span className="count-badge">{likelyScams.length} likely</span>
            )}
            {needsReview.length > 0 && (
              <span className="count-badge amber">{needsReview.length} review</span>
            )}
          </div>

          {likelyScams.map(flag => (
            <ScamCard
              key={flag.emailId}
              flag={flag}
              email={emails.find(e => e.id === flag.emailId)}
            />
          ))}

          {needsReview.map(flag => (
            <ScamCard
              key={flag.emailId}
              flag={flag}
              email={emails.find(e => e.id === flag.emailId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
