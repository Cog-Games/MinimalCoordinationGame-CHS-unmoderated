import nodemailer from 'nodemailer';

const escapeHtml = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user, pass }
  });
  return transporter;
};

export async function sendWithdrawalDeletionEmail({ to, deletionUrl, expiresAt }) {
  const mailer = getTransporter();
  if (!mailer) {
    if (process.env.NODE_ENV === 'production' && process.env.STUDY_EMAIL_TEST_MODE !== 'true') {
      throw new Error('Parent email delivery is not configured.');
    }
    return { sent: false, mode: 'test-link' };
  }

  const safeUrl = escapeHtml(deletionUrl);
  const expiration = new Date(expiresAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });
  await mailer.sendMail({
    from: process.env.STUDY_EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: process.env.STUDY_WITHDRAWAL_EMAIL_SUBJECT || 'Your study withdrawal and deletion link',
    text: `You requested a link that can withdraw this study session and delete its stored video and behavioral data. Open this link and confirm deletion: ${deletionUrl}\n\nThis link expires on ${expiration}. Do not forward it.`,
    html: `<p>You requested a link that can withdraw this study session and delete its stored video and behavioral data.</p><p><a href="${safeUrl}">Open the withdrawal and deletion page</a></p><p>This link expires on ${escapeHtml(expiration)}. Do not forward it.</p>`
  });
  return { sent: true, mode: 'smtp' };
}
