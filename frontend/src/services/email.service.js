export const sendWelcomeEmail = async ({ name, email, regNo }) => {
  try {
    const payload = {
      name, email, regNo,
      subject: 'FYP Portal Account Created - CUI-ATD',
    };

    const res = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Backend email API error:', res.status, errBody);
      return { success: false, error: errBody };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
};
