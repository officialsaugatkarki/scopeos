import { Resend } from "resend";

/**
 * Lazy Resend client — server-side only.
 *
 * Why lazy? Vercel evaluates API route modules during `next build` to collect
 * page data. At that point environment variables are not yet injected.
 * Instantiating `new Resend(...)` at module level causes:
 *   "Error: Missing API key. Pass it to the constructor `new Resend('re_123')`"
 *
 * By deferring instantiation to the first call we guarantee the constructor
 * only runs at request-time, when RESEND_API_KEY is available.
 */
let _resend: Resend | null = null;

export function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "[Resend] Missing RESEND_API_KEY. " +
        "Add it to Vercel → Settings → Environment Variables and redeploy."
      );
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}
