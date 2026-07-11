import crypto from 'crypto';

const COOKIE_NAME = 'gridworld_study_session';

export const hashToken = token => crypto.createHash('sha256').update(String(token)).digest('hex');

export const createAccessToken = () => crypto.randomBytes(32).toString('base64url');

export function setStudySessionCookie(res, sessionId, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(`${sessionId}.${token}`)}; Path=/; HttpOnly; SameSite=Strict${secure}; Max-Age=86400`
  );
}

export function clearStudySessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict${secure}; Max-Age=0`);
}

function parseCookies(header = '') {
  return Object.fromEntries(
    String(header)
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const index = part.indexOf('=');
        return index === -1
          ? [part, '']
          : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

export async function requireStudySession(req, res, store) {
  const cookie = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!cookie) {
    res.status(401).json({ error: 'Study session is missing or expired.' });
    return null;
  }
  const separator = cookie.indexOf('.');
  if (separator < 1) {
    res.status(401).json({ error: 'Invalid study session.' });
    return null;
  }
  const sessionId = cookie.slice(0, separator);
  const token = cookie.slice(separator + 1);
  const session = await store.getSession(sessionId);
  if (!session || session.accessTokenHash !== hashToken(token) || session.status === 'withdrawn') {
    res.status(401).json({ error: 'Invalid or withdrawn study session.' });
    return null;
  }
  return session;
}

export function requireAdmin(req, res) {
  const configured = process.env.STUDY_ADMIN_API_KEY;
  const supplied = req.get('x-admin-key');
  if (!configured || !supplied || supplied.length !== configured.length) {
    res.status(401).json({ error: 'Administrator authentication required.' });
    return false;
  }
  const valid = crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(configured));
  if (!valid) {
    res.status(401).json({ error: 'Administrator authentication required.' });
    return false;
  }
  return true;
}
