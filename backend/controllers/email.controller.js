/**
 * Email Controller
 *
 * Handles transactional email sending via Brevo (Sendinblue) API.
 * Used to send welcome emails with credentials to newly onboarded students.
 *
 * @module controllers/email
 *
 * @see https://developers.brevo.com/reference/sendtransacemail
 */

const { sendSuccess, sendError } = require('../utils/response');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'internshipofficecuiatd@gmail.com';
const SENDER_NAME = process.env.SENDER_NAME || 'CUI-ATD';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Build the HTML email template for welcome emails.
 *
 * @param {string} name - Student's full name
 * @param {string} email - Student's email address
 * @param {string} regNo - Student's registration number
 * @returns {string} HTML email body
 */
const buildWelcomeEmailHtml = (name, email, regNo) => {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f7fc">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fc;padding:40px 20px">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a,#172554);padding:32px 24px;text-align:center">
              <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0;letter-spacing:0.5px">FYP Portal</h1>
              <p style="color:#93c5fd;font-size:13px;margin:8px 0 0;font-weight:500">COMSATS University Islamabad, Abbottabad Campus</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px">
              <h2 style="color:#1e3a8a;font-size:18px;font-weight:700;margin:0 0 16px">Welcome, ${name}!</h2>
              <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 20px">
                Your account has been created successfully on the FYP Portal. Below are your login credentials:
              </p>
              <table width="100%" style="background-color:#f8fafc;border-radius:12px;padding:20px;margin:0 0 24px">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600">Registration No.</td>
                  <td style="padding:6px 0;font-size:13px;color:#1e293b;font-weight:700;text-align:right;font-family:monospace">${regNo}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600">Email</td>
                  <td style="padding:6px 0;font-size:13px;color:#1e293b;font-weight:700;text-align:right">${email}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600">Password</td>
                  <td style="padding:6px 0;font-size:13px;color:#1e293b;font-weight:700;text-align:right;font-family:monospace">123</td>
                </tr>
              </table>
              <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0 0 4px;font-weight:500">Please change your password after your first login.</p>
              <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0 0 20px;font-weight:500">Visit: <a href="https://fyp.artdevelopers.site" style="color:#1e3a8a;font-weight:700;text-decoration:none">fyp.artdevelopers.site</a></p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:20px 28px;text-align:center;border-top:1px solid #e2e8f0">
              <p style="color:#94a3b8;font-size:11px;margin:0;font-weight:500">COMSATS University Islamabad, Abbottabad Campus</p>
              <p style="color:#cbd5e1;font-size:10px;margin:6px 0 0">This is an automated message. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
};

/**
 * POST /api/send-welcome-email
 * Sends a welcome email to a newly registered student via Brevo API.
 *
 * @param {object} req - Express request
 * @param {object} req.body - { name, email, regNo }
 * @param {object} res - Express response
 *
 * @returns {object} { success, message }
 *
 * @throws 400 - Missing required fields
 * @throws 500 - BREVO_API_KEY not configured
 * @throws 502 - Brevo API returned error
 */
const sendWelcomeEmail = async (req, res, next) => {
  try {
    const { name, email, regNo } = req.body;

    if (!name || !email || !regNo) {
      return sendError(res, 'Missing required fields: name, email, regNo', 400);
    }

    if (!BREVO_API_KEY) {
      return sendError(res, 'BREVO_API_KEY not configured on server', 500);
    }

    // Build email payload for Brevo API
    const payload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email, name }],
      subject: 'FYP Portal Account Created - CUI-ATD',
      htmlContent: buildWelcomeEmailHtml(name, email, regNo),
    };

    // Send via Brevo API
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[Email] Brevo API error:', response.status, errBody);
      return sendError(res, 'Failed to send email via Brevo', 502, errBody);
    }

    return sendSuccess(res, null, 'Welcome email sent successfully');
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    next(error);
  }
};

module.exports = { sendWelcomeEmail };
