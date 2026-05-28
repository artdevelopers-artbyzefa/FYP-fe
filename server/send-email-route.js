const express = require('express');
const router = express.Router();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'internshipofficecuiatd@gmail.com';
const SENDER_NAME = process.env.SENDER_NAME || 'CUI-ATD';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// POST /api/send-welcome-email
router.post('/send-welcome-email', async (req, res) => {
  try {
    const { name, email, regNo } = req.body;

    if (!name || !email || !regNo) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, email, regNo' });
    }

    if (!BREVO_API_KEY) {
      return res.status(500).json({ success: false, message: 'BREVO_API_KEY not configured on server' });
    }

    const htmlContent = `
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
              <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0;font-weight:500">Visit: <a href="https://fyp.cuiatd.edu.pk" style="color:#1e3a8a;font-weight:700;text-decoration:none">fyp.cuiatd.edu.pk</a></p>
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

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email, name }],
        subject: 'FYP Portal Account Created - CUI-ATD',
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Brevo API error:', response.status, errBody);
      return res.status(502).json({ success: false, message: 'Brevo API error', error: errBody });
    }

    res.json({ success: true, message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
