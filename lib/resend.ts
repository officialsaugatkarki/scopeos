import { Resend } from "resend";

/**
 * Resend client — server-side only.
 * The API key must be set in RESEND_API_KEY environment variable.
 * Never expose this module to client-side bundles.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);
