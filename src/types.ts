// Core data types for Job Hunt Autopilot

export type EmailCategory =
  | "application_acknowledgment"
  | "interview_invitation"
  | "rejection"
  | "offer"
  | "scam"
  | "other";

export interface RawEmail {
  id: number;
  from: string;
  subject: string;
  date: string; // ISO
  body: string;
}

export interface Classification {
  emailId: number;
  category: EmailCategory;
  company: string | null;
  role: string | null;
  isScamSuspected: boolean;
  riskReasons: string[]; // concrete evidence quoted or paraphrased from the email; empty if not suspicious
  confidence: "low" | "medium" | "high";
}

export interface Application {
  id: string; // slug of normalized company + role
  company: string;
  role: string | null;
  stage: "applied" | "interview" | "offer" | "rejected";
  emails: number[]; // email ids, sorted by date ascending
  lastEmployerResponseAt: string;
  reminderDueAt: string | null;
}

export type ScamSeverity = "likely" | "needs_review";

export interface ScamFlag {
  emailId: number;
  severity: ScamSeverity;
  geminiReasons: string[];
  ruleHits: string[];
}

export interface AppState {
  emails: RawEmail[];
  classifications: Record<number, Classification>;
  applications: Application[];
  scamFlags: ScamFlag[];
  classificationErrors: number[]; // emailIds that failed classification
}

export type ClassificationStatus = "idle" | "classifying" | "done" | "error";
