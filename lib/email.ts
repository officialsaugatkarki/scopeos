/**
 * generateOtpTemplate
 * Returns a production-ready, responsive HTML email for OTP verification.
 * Compatible with Gmail, Outlook (2013–2021), and Apple Mail.
 * Uses only inline styles — no external CSS, no web fonts, no images.
 */
export function generateOtpTemplate(otp: string): string {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <title>Verify your ScopeOS account</title>
  <style type="text/css">
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    /* Responsiveness */
    @media screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; min-width: 100% !important; }
      .email-content { padding: 24px 20px !important; }
      .otp-code { font-size: 36px !important; letter-spacing: 6px !important; }
      .btn { padding: 14px 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0D1117; -webkit-font-smoothing: antialiased;">

  <!-- Email Wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0D1117;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 16px;">

        <!-- Email Card -->
        <table class="email-wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #161B22; border-radius: 16px; overflow: hidden; border: 1px solid #30363D;">

          <!-- ── TOP ACCENT BAR ── -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- ── HEADER ── -->
          <tr>
            <td align="center" style="padding: 40px 48px 32px 48px; background-color: #161B22;">
              <!-- Logo mark -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 12px; padding: 12px 20px;">
                          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; white-space: nowrap;">ScopeOS</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 26px; font-weight: 700; color: #F0F6FC; line-height: 1.3; letter-spacing: -0.3px;">Verify your email address</h1>
              <p style="margin: 12px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; color: #8B949E; line-height: 1.6;">Use the code below to confirm your spot on the ScopeOS waitlist.</p>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding: 0 48px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr><td style="border-top: 1px solid #30363D; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- ── OTP BLOCK ── -->
          <tr>
            <td class="email-content" align="center" style="padding: 40px 48px;">
              <p style="margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #8B949E; letter-spacing: 1px; text-transform: uppercase;">Your verification code</p>

              <!-- OTP Display Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 32px auto;">
                <tr>
                  <td style="background-color: #0D1117; border: 2px solid #6366F1; border-radius: 12px; padding: 24px 48px; text-align: center;">
                    <span class="otp-code" style="font-family: 'Courier New', Courier, 'Lucida Console', monospace; font-size: 48px; font-weight: 800; color: #F0F6FC; letter-spacing: 10px; display: block; line-height: 1;">${otp}</span>
                  </td>
                </tr>
              </table>

              <!-- Expiry Notice -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 32px auto;">
                <tr>
                  <td style="background-color: #1C2128; border-radius: 8px; padding: 12px 20px;">
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; color: #E3B341;">
                      ⏱ &nbsp;This code expires in <strong>10 minutes</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Instruction copy -->
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #8B949E; line-height: 1.7; max-width: 400px; margin: 0 auto;">
                Enter this code in the verification screen to confirm your email and secure your place on the waitlist.
              </p>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding: 0 48px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr><td style="border-top: 1px solid #30363D; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- ── SECURITY NOTE ── -->
          <tr>
            <td style="padding: 24px 48px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1C2128; border-radius: 8px; border-left: 3px solid #6366F1;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #8B949E; line-height: 1.6;">
                      <strong style="color: #C9D1D9;">Didn't request this?</strong> You can safely ignore this email. Someone may have typed your email address by mistake. Your account is secure — no action is required.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td align="center" style="padding: 24px 48px 36px 48px; background-color: #0D1117; border-top: 1px solid #21262D;">
              <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #484F58;">
                &copy; ${year} ScopeOS &nbsp;&middot;&nbsp; All rights reserved
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #30363D;">
                Sent from noreply@k-kinfotech.com
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}
