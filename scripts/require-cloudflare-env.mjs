/**
 * Direct upload to Cloudflare Pages needs an account and an API token.
 * Wrangler reads both from the environment. There is no default: a missing
 * or empty value stops the deploy before Wrangler can prompt for a login.
 */
const required = ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"];

for (const name of required) {
  const value = process.env[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing required environment variable ${name}`);
  }
}
