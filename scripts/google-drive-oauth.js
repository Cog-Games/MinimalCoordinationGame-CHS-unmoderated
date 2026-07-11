import 'dotenv/config';
import crypto from 'crypto';
import http from 'http';
import { google } from 'googleapis';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:53682/oauth2callback';

if (!clientId || !clientSecret) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first.');
  process.exitCode = 1;
} else {
  const redirect = new URL(redirectUri);
  if (!['localhost', '127.0.0.1'].includes(redirect.hostname)) {
    throw new Error('GOOGLE_OAUTH_REDIRECT_URI must use localhost for this helper.');
  }

  const oauth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const state = crypto.randomBytes(24).toString('base64url');
  const authorizationUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    state,
    scope: ['https://www.googleapis.com/auth/drive']
  });

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, redirectUri);
    if (url.pathname !== redirect.pathname) {
      response.writeHead(404).end('Not found');
      return;
    }
    const code = url.searchParams.get('code');
    const oauthError = url.searchParams.get('error');
    if (oauthError || !code || url.searchParams.get('state') !== state) {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end(`Authorization failed: ${oauthError || (!code ? 'missing code' : 'invalid state')}`);
      server.close();
      return;
    }
    try {
      const { tokens } = await oauth.getToken(code);
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Google Drive authorization succeeded. Return to the terminal.');
      console.log('\nAdd this secret to .env (and never commit it):');
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      if (!tokens.refresh_token) {
        console.warn('No refresh token was returned. Revoke this app in your Google Account and run the helper again.');
      }
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Token exchange failed. Return to the terminal for details.');
      console.error(error.message);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });

  server.listen(Number(redirect.port || 80), redirect.hostname, () => {
    console.log('Open this URL in your browser and authorize the test Drive account:\n');
    console.log(authorizationUrl);
    console.log(`\nWaiting for Google to redirect to ${redirectUri}`);
  });
}
