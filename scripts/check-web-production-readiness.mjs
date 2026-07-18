import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();

const requiredPublicEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const requiredRoutes = [
  "privacy",
  "terms",
  "support",
  "account-deletion",
  "community-guidelines",
  "content-policy",
];

const requiredHeaderSnippets = [
  "Strict-Transport-Security:",
  "X-Content-Type-Options: nosniff",
  "Referrer-Policy:",
  "X-Frame-Options: DENY",
  "Permissions-Policy:",
  "Content-Security-Policy:",
];

const requiredFirebaseCspHosts = [
  "https://*.googleapis.com",
  "https://*.firebaseio.com",
  "https://*.firebaseapp.com",
];

const errors = [];

const requireFile = (relativePath) => {
  const absolutePath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${relativePath} is missing.`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
};

for (const route of requiredRoutes) {
  requireFile(path.join("src", "app", route, "page.tsx"));
}

const headers = requireFile(path.join("public", "_headers"));
for (const snippet of requiredHeaderSnippets) {
  if (!headers.includes(snippet)) {
    errors.push(`public/_headers must include "${snippet}".`);
  }
}

const packageJson = JSON.parse(requireFile("package.json") || "{}");
if (packageJson.dependencies?.firebase) {
  for (const host of requiredFirebaseCspHosts) {
    if (!headers.includes(host)) {
      errors.push(`public/_headers CSP must allow Firebase host ${host}.`);
    }
  }
}

const securityTxt = requireFile(path.join("public", ".well-known", "security.txt"));
if (!/Contact:\s*mailto:security@bookhood\.app/i.test(securityTxt)) {
  errors.push("security.txt must include the security@bookhood.app contact.");
}
const expiresMatch = securityTxt.match(/^Expires:\s*(.+)$/im);
if (!expiresMatch || Number.isNaN(Date.parse(expiresMatch[1])) || Date.parse(expiresMatch[1]) <= Date.now()) {
  errors.push("security.txt must include a future Expires timestamp.");
}

const releaseTarget = process.env.BOOKHOOD_WEB_RELEASE_TARGET ?? "public";
if (releaseTarget === "public") {
  for (const key of requiredPublicEnv) {
    if (!process.env[key]?.trim()) {
      errors.push(`${key} is required for public web release builds.`);
    }
  }
}

if (errors.length > 0) {
  console.error("HARD FAIL: Web production readiness check failed:");
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log("Web production readiness checks passed.");
