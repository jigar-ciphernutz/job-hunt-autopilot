import { useState, useCallback, useRef, useEffect, type ChangeEvent } from 'react';
import type { RawEmail, Classification, Application, AppState, ScamFlag, ClassificationStatus } from './types';
import { saveState, loadState, clearState, clearCache } from './storage';
import { classifyEmails, isGeminiConfigured, type ClassifyProgress } from './gemini';
import { groupEmailsIntoApplications } from './grouping';
import { checkScamRules } from './scamRules';
import { applyReminders, DEFAULT_REFERENCE_DATE } from './reminders';
import { ApplicationCard } from './components/ApplicationCard';
import { DetailPanel } from './components/DetailPanel';
import { NeedsAttentionPanel } from './components/NeedsAttentionPanel';
import './index.css';

// Validate raw email structure
function validateEmails(data: unknown): RawEmail[] {
  if (!Array.isArray(data)) throw new Error('JSON must be an array of emails');
  return data.map((item: unknown, i: number) => {
    const e = item as Record<string, unknown>;
    if (typeof e.id !== 'number') throw new Error(`Email at index ${i} missing numeric 'id'`);
    if (typeof e.from !== 'string') throw new Error(`Email ${e.id} missing 'from'`);
    if (typeof e.subject !== 'string') throw new Error(`Email ${e.id} missing 'subject'`);
    if (typeof e.date !== 'string') throw new Error(`Email ${e.id} missing 'date'`);
    if (typeof e.body !== 'string') throw new Error(`Email ${e.id} missing 'body'`);
    return e as unknown as RawEmail;
  });
}

function buildScamFlags(
  emails: RawEmail[],
  classifications: Record<number, Classification>
): ScamFlag[] {
  const flags: ScamFlag[] = [];

  for (const email of emails) {
    const cls = classifications[email.id];
    if (!cls) continue;

    const ruleResult = checkScamRules(email);
    const geminiSuspected = cls.isScamSuspected || cls.category === 'scam';
    const rulesFlagged = ruleResult.hits.length > 0;

    if (!geminiSuspected && !rulesFlagged) continue;

    let severity: ScamFlag['severity'];
    if (geminiSuspected && rulesFlagged) {
      severity = 'likely';
    } else {
      severity = 'needs_review';
    }

    flags.push({
      emailId: email.id,
      severity,
      geminiReasons: cls.riskReasons ?? [],
      ruleHits: ruleResult.hits,
    });
  }

  return flags;
}

const STAGES: Array<{ key: Application['stage']; label: string }> = [
  { key: 'applied', label: 'Applied' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
];

export default function App() {
  const [emails, setEmails] = useState<RawEmail[]>([]);
  const [classifications, setClassifications] = useState<Record<number, Classification>>({});
  const [applications, setApplications] = useState<Application[]>([]);
  const [scamFlags, setScamFlags] = useState<ScamFlag[]>([]);
  const [classificationErrors, setClassificationErrors] = useState<number[]>([]);
  const [classifyStatus, setClassifyStatus] = useState<ClassificationStatus>('idle');
  const [progress, setProgress] = useState<ClassifyProgress | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [today, setToday] = useState(DEFAULT_REFERENCE_DATE);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted state on mount
  useEffect(() => {
    const persisted = loadState();
    if (persisted) {
      setEmails(persisted.emails);
      setClassifications(persisted.classifications);
      setApplications(persisted.applications);
      setScamFlags(persisted.scamFlags);
      setClassificationErrors(persisted.classificationErrors);
      if (persisted.emails.length > 0) setClassifyStatus('done');
    }
  }, []);

  const processClassifications = useCallback(
    (rawEmails: RawEmail[], cls: Record<number, Classification>, errorIds: number[]) => {
      const flags = buildScamFlags(rawEmails, cls);

      // Group into applications (exclude scam emails)
      const grouped = groupEmailsIntoApplications(rawEmails, cls);
      const withReminders = applyReminders(grouped, today);

      const state: AppState = {
        emails: rawEmails,
        classifications: cls,
        applications: withReminders,
        scamFlags: flags,
        classificationErrors: errorIds,
      };

      setApplications(withReminders);
      setScamFlags(flags);
      setClassificationErrors(errorIds);
      saveState(state);
    },
    [today]
  );

  const runClassification = useCallback(
    async (
      emailsToClassify: RawEmail[],
      existingCls?: Record<number, Classification>,
      bypassCache: boolean = false
    ) => {
      setClassifyStatus('classifying');
      setImportError(null);
      try {
        const { results, errorIds } = await classifyEmails(
          emailsToClassify,
          (p) => {
            setProgress(p);
          },
          bypassCache
        );

        const merged = { ...(existingCls ?? {}), ...results };
        setClassifications(merged);
        processClassifications(emailsToClassify, merged, errorIds);
        setClassifyStatus('done');
      } catch (e) {
        console.error('[App] Classification failed:', e);
        setImportError(`Classification failed: ${e instanceof Error ? e.message : String(e)}`);
        setClassifyStatus('error');
      }
    },
    [processClassifications]
  );

  const handleFileImport = useCallback(
    async (file: File) => {
      setImportError(null);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const parsed = validateEmails(data);
        setEmails(parsed);
        await runClassification(parsed);
      } catch (e) {
        setImportError(`Import error: ${e instanceof Error ? e.message : String(e)}`);
      }
    },
    [runClassification]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileImport(file);
      // Reset so same file can be re-imported
      e.target.value = '';
    },
    [handleFileImport]
  );

  const handleRerun = useCallback(() => {
    if (emails.length === 0) return;
    runClassification(emails, classifications, true);
  }, [emails, classifications, runClassification]);

  const handleLoadSample = useCallback(async () => {
    try {
      setImportError(null);
      const res = await fetch('/sample-emails.json');
      if (!res.ok) throw new Error('Could not load /sample-emails.json');
      const data = await res.json();
      const parsed = validateEmails(data);
      setEmails(parsed);
      await runClassification(parsed);
    } catch (e) {
      setImportError(`Failed to load sample data: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [runClassification]);

  const handleClear = useCallback(() => {
    clearState();
    clearCache();
    setEmails([]);
    setClassifications({});
    setApplications([]);
    setScamFlags([]);
    setClassificationErrors([]);
    setSelectedAppId(null);
    setClassifyStatus('idle');
  }, []);

  // Recalculate applications when today changes
  useEffect(() => {
    if (applications.length > 0) {
      const withReminders = applyReminders(applications, today);
      setApplications(withReminders);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const selectedApp = applications.find(a => a.id === selectedAppId) ?? null;

  const progressPercent = progress
    ? Math.round((progress.completed / Math.max(progress.total, 1)) * 100)
    : 0;

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-logo">
          <div className="header-logo-icon">✈</div>
          <h1>Job Hunt Autopilot</h1>
          {isGeminiConfigured() ? (
            <span className="header-badge live" title="Using live Gemini 2.0 Flash via Firebase AI">
              ● Gemini 2.0 Flash
            </span>
          ) : (
            <span className="header-badge demo" title="Live API key not set in .env. Pre-classified dataset enabled for demo.">
              ● Demo Mode
            </span>
          )}
        </div>

        <div className="header-spacer" />

        <div className="header-controls">
          <span className="date-picker-label">Reference date:</span>
          <input
            type="date"
            className="date-input"
            value={today}
            onChange={e => setToday(e.target.value)}
            aria-label="Reference date for reminder calculations"
          />

          <label className="file-input-label" htmlFor="email-file-input">
            📥 Import Emails
          </label>
          <input
            id="email-file-input"
            type="file"
            accept=".json,application/json"
            className="file-input-hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            aria-label="Import emails JSON file"
          />

          {emails.length > 0 && (
            <>
              <button
                className="btn btn-secondary"
                onClick={handleRerun}
                disabled={classifyStatus === 'classifying'}
                aria-label="Re-run classification"
              >
                🔄 Re-classify
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleClear}
                title="Clear all data and reset"
                aria-label="Clear all data"
              >
                ✕ Clear
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="app-main">
        <div className="pipeline-area">
          {importError && (
            <div className="error-banner" role="alert" style={{ lineHeight: 1.6 }}>
              ⚠️ {importError.includes('https://') ? (
                <>
                  {importError.split('https://')[0]}
                  <a
                    href={`https://${importError.split('https://')[1].split(' ')[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    https://{importError.split('https://')[1].split(' ')[0]}
                  </a>
                  {' ' + importError.split('https://')[1].split(' ').slice(1).join(' ')}
                </>
              ) : (
                importError
              )}
            </div>
          )}

          {classificationErrors.length > 0 && (
            <div className="error-banner" role="alert" style={{ background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#facc15' }}>
              ⚠️ {classificationErrors.length} email{classificationErrors.length > 1 ? 's' : ''} encountered an issue during classification.
            </div>
          )}

          {/* Progress indicator */}
          {classifyStatus === 'classifying' && progress && (
            <div className="progress-bar-wrap" role="status" aria-live="polite">
              <div className="progress-label">
                <div className="spinner" aria-hidden="true" />
                Classifying emails with Gemini…
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="progress-stats">
                <span>{progress.completed}/{progress.total} processed</span>
                {progress.cached > 0 && <span>({progress.cached} from cache)</span>}
              </div>
            </div>
          )}

          {emails.length === 0 ? (
            <div className="empty-state animate-in">
              <div className="empty-state-icon">✈️</div>
              <h2>No emails imported yet</h2>
              <p>
                Import your job-related emails to analyze applications, uncover suspected scams with observable evidence, and track follow-up deadlines automatically.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📥 Import Emails (JSON)
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleLoadSample}
                  id="btn-load-sample"
                >
                  ✨ Load 20 Sample Emails (Demo)
                </button>
              </div>
            </div>
          ) : classifyStatus === 'classifying' ? (
            <div className="empty-state">
              <div className="empty-state-icon">🧠</div>
              <h2>Classifying your emails…</h2>
              <p>Gemini is analyzing {emails.length} emails. This may take a moment.</p>
            </div>
          ) : (
            <>
              <div className="pipeline-title">
                Application Pipeline
                <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: 12 }}>
                  {applications.length} application{applications.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="pipeline-board">
                {STAGES.map(({ key, label }) => {
                  const stageApps = applications.filter(a => a.stage === key);
                  return (
                    <div key={key} className="pipeline-column">
                      <div className="column-header">
                        <div className={`column-dot ${key}`} aria-hidden="true" />
                        <span className="column-title">{label}</span>
                        <span className="column-count">{stageApps.length}</span>
                      </div>
                      <div className="column-cards">
                        {stageApps.length === 0 ? (
                          <div className="column-empty">No applications</div>
                        ) : (
                          stageApps.map(app => (
                            <ApplicationCard
                              key={app.id}
                              app={app}
                              today={today}
                              selected={selectedAppId === app.id}
                              onClick={() =>
                                setSelectedAppId(prev => (prev === app.id ? null : app.id))
                              }
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── Side Panel ── */}
        <aside className="side-panel" aria-label="Needs attention">
          <NeedsAttentionPanel
            applications={applications}
            emails={emails}
            scamFlags={scamFlags}
            today={today}
            onSelectApp={id => setSelectedAppId(id)}
          />
        </aside>
      </main>

      {/* ── Detail Panel (overlay) ── */}
      {selectedApp && (
        <DetailPanel
          app={selectedApp}
          emails={emails}
          classifications={classifications}
          today={today}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </div>
  );
}
