// Application grouping logic
// Groups non-scam classified emails into Application records

import type { RawEmail, Classification, Application, EmailCategory } from './types';

// Normalize company name: lowercase, strip punctuation and common suffixes
export function normalizeCompany(company: string): string {
  return company
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\b(pvt|ltd|limited|inc|incorporated|technologies|technology|solutions|solution|services|service|systems|system|group|india|global|international)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalize role: lowercase, strip punctuation
export function normalizeRole(role: string | null): string {
  if (!role) return '';
  return role
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Make a slug id for an application
export function makeAppId(company: string, role: string | null): string {
  const nc = normalizeCompany(company);
  const nr = normalizeRole(role);
  return [nc, nr].filter(Boolean).join('|');
}

// Map email category to application stage weight
const STAGE_WEIGHT: Record<EmailCategory, number> = {
  application_acknowledgment: 1,
  interview_invitation: 2,
  offer: 3,
  rejection: 3, // terminal, same weight as offer; latest wins
  scam: 0,
  other: 0,
};

type AppStage = Application['stage'];

function categoryToStage(cat: EmailCategory): AppStage | null {
  switch (cat) {
    case 'application_acknowledgment': return 'applied';
    case 'interview_invitation': return 'interview';
    case 'offer': return 'offer';
    case 'rejection': return 'rejected';
    default: return null;
  }
}

export function groupEmailsIntoApplications(
  emails: RawEmail[],
  classifications: Record<number, Classification>
): Application[] {
  // Sort emails by date ascending
  const sorted = [...emails].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Map of appId -> partial application data
  const appMap = new Map<string, {
    company: string;
    role: string | null;
    emails: number[];
    stages: Array<{ stage: AppStage; date: string }>;
  }>();

  // First pass: process all emails with a known company AND known role
  // Null-role emails are handled separately in the second pass
  for (const email of sorted) {
    const cls = classifications[email.id];
    if (!cls) continue;
    if (cls.category === 'scam' || cls.isScamSuspected) continue;
    if (!cls.company || cls.role === null) continue; // skip if no company or no role

    // Only include categories that produce a stage
    const stage = categoryToStage(cls.category);
    if (!stage) continue;

    const appId = makeAppId(cls.company, cls.role);
    
    if (!appMap.has(appId)) {
      appMap.set(appId, {
        company: cls.company,
        role: cls.role,
        emails: [],
        stages: [],
      });
    }

    const app = appMap.get(appId)!;
    app.emails.push(email.id);
    app.stages.push({ stage, date: email.date });
  }

  // Handle role-null emails: attach to the single existing app for that company if exactly one exists
  for (const email of sorted) {
    const cls = classifications[email.id];
    if (!cls) continue;
    if (cls.category === 'scam' || cls.isScamSuspected) continue;
    if (!cls.company || cls.role !== null) continue; // skip if role is known (already processed) or no company

    const stage = categoryToStage(cls.category);
    if (!stage) continue;

    const normalizedCompany = normalizeCompany(cls.company);
    
    // Find all apps for this company
    const companyApps = [...appMap.entries()].filter(([, app]) =>
      normalizeCompany(app.company) === normalizedCompany
    );

    if (companyApps.length === 1) {
      // Attach to the existing app
      const [, app] = companyApps[0];
      if (!app.emails.includes(email.id)) {
        app.emails.push(email.id);
        app.stages.push({ stage, date: email.date });
      }
    } else {
      // Create new app with role null (or update existing null-role app)
      const nullRoleId = makeAppId(cls.company, null);
      if (!appMap.has(nullRoleId)) {
        appMap.set(nullRoleId, {
          company: cls.company,
          role: null,
          emails: [],
          stages: [],
        });
      }
      const app = appMap.get(nullRoleId)!;
      if (!app.emails.includes(email.id)) {
        app.emails.push(email.id);
        app.stages.push({ stage, date: email.date });
      }
    }
  }

  // Build final Application objects
  const applications: Application[] = [];

  for (const [id, data] of appMap.entries()) {
    if (data.emails.length === 0) continue;

    // Sort emails by date
    const sortedEmails = data.emails.sort((a, b) => {
      const emailA = emails.find(e => e.id === a);
      const emailB = emails.find(e => e.id === b);
      if (!emailA || !emailB) return 0;
      return new Date(emailA.date).getTime() - new Date(emailB.date).getTime();
    });

    // Determine stage: furthest stage reached
    // For terminal stages (offer/rejected), the latest one wins
    let finalStage: AppStage = 'applied';
    let maxWeight = 0;
    let latestTerminalStage: AppStage | null = null;
    let latestTerminalDate = '';

    for (const { stage, date } of data.stages) {
      const weight = STAGE_WEIGHT[stageToCategory(stage)];
      if (weight > maxWeight) {
        maxWeight = weight;
        finalStage = stage;
      }
      // Track terminal stages by date
      if (stage === 'offer' || stage === 'rejected') {
        if (!latestTerminalDate || date > latestTerminalDate) {
          latestTerminalDate = date;
          latestTerminalStage = stage;
        }
      }
    }

    // If there are terminal stages, the latest one wins
    if (latestTerminalStage) {
      finalStage = latestTerminalStage;
    }

    // lastEmployerResponseAt = date of most recent email
    const mostRecentEmail = emails.find(e => e.id === sortedEmails[sortedEmails.length - 1]);
    const lastEmployerResponseAt = mostRecentEmail?.date ?? '';

    applications.push({
      id,
      company: data.company,
      role: data.role,
      stage: finalStage,
      emails: sortedEmails,
      lastEmployerResponseAt,
      reminderDueAt: null, // computed by reminders module
    });
  }

  return applications;
}

// Helper to convert stage back to a category for weight lookup
function stageToCategory(stage: AppStage): EmailCategory {
  switch (stage) {
    case 'applied': return 'application_acknowledgment';
    case 'interview': return 'interview_invitation';
    case 'offer': return 'offer';
    case 'rejected': return 'rejection';
  }
}
