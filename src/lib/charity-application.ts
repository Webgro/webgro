/**
 * Shared by the charity application form (src/components/preview/industries/
 * CharityApply.tsx) and its route handler (src/app/api/charity-application).
 * No zod here, so the browser bundle stays small. The route builds its schema
 * from these limits.
 */

export const CHARITY_LIMITS = {
  charityName: 160,
  charityNumber: 40,
  charityWebsite: 200,
  about: 2000,
  needs: 2000,
  difference: 2000,
  contactName: 120,
  role: 120,
  email: 200,
  phone: 40,
} as const;

export type CharityField = keyof typeof CHARITY_LIMITS;

/** The JSON body the form posts. */
export type CharityApplicationBody = {
  charityName: string;
  charityNumber?: string;
  notRegistered: boolean;
  charityWebsite?: string;
  about: string;
  needs: string;
  difference: string;
  contactName: string;
  role: string;
  email: string;
  phone?: string;
  agreed: true;
  /** Newsletter opt-in. Off unless the person ticked the box. */
  newsletter: boolean;
  /** Honeypot. Always empty for people. */
  hp?: string;
  turnstileToken?: string;
};

export type CharityApplicationResponse =
  | { ok: true }
  | { ok: false; error: string; fields?: Partial<Record<CharityField | "agreed", string>> };

/** Messages for missing or invalid fields, used on both sides so they match. */
export const CHARITY_FIELD_ERRORS: Partial<Record<CharityField | "agreed", string>> = {
  charityName: "Enter the charity's name.",
  about: "Tell us what the charity does.",
  needs: "Tell us what the charity needs from a website.",
  difference: "Tell us what difference a website would make.",
  contactName: "Enter your name.",
  role: "Enter your role at the charity.",
  email: "Enter an email address, like name@charity.org.uk.",
  agreed: "Tick this box to agree to the Privacy Policy.",
};

/** Loose on purpose: the server does the real check. */
export const CHARITY_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
