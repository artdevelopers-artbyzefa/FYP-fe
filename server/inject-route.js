const fs = require('fs');
const path = require('path');

const BACKEND_DIR = process.argv[2] || '/var/www/fyp';
const BREVO_API_KEY = process.argv[3] || '';
const ROUTE_FILE = path.join(BACKEND_DIR, 'routes', 'send-email-route.js');
const ROUTE_SOURCE = path.join(__dirname, 'send-email-route.js');
const INJECT_MARKER = '// INJECTED: send-email-route';

// Step 1: Copy route file
if (!fs.existsSync(path.join(BACKEND_DIR, 'routes'))) {
  fs.mkdirSync(path.join(BACKEND_DIR, 'routes'), { recursive: true });
}
fs.copyFileSync(ROUTE_SOURCE, ROUTE_FILE);
console.log(`✓ Copied route to ${ROUTE_FILE}`);

// Step 2: Find the main app file
const candidates = ['app.js', 'index.js', 'server.js', 'main.js'];
let mainFile = null;
for (const c of candidates) {
  const p = path.join(BACKEND_DIR, c);
  if (fs.existsSync(p)) { mainFile = p; break; }
}
if (!mainFile) {
  console.error('✗ Could not find main app file (app.js/index.js/server.js)');
  process.exit(1);
}

const code = fs.readFileSync(mainFile, 'utf-8');

// Step 3: Check if already injected
if (code.includes(INJECT_MARKER)) {
  console.log('✓ Route already injected, skipping');
  process.exit(0);
}

// Step 4: Find insertion point - right before app.listen or module.exports
const insertPointers = [
  { pattern: /(app\.listen\s*\()/m, insertBefore: true },
  { pattern: /(module\.exports\s*=)/m, insertBefore: true },
  { pattern: /(const\s+app\s*=\s*express\(\))/m, insertBefore: false },
];
const IMPORT_LINES = `\n${INJECT_MARKER}\nconst sendEmailRoute = require('./routes/send-email-route');\napp.use('/api', sendEmailRoute);\n${INJECT_MARKER}\n`;

let newCode = null;
for (const { pattern, insertBefore } of insertPointers) {
  const match = code.match(pattern);
  if (match) {
    const idx = match.index;
    const insertionIdx = insertBefore ? idx : idx + match[0].length;
    newCode = code.slice(0, insertionIdx) + IMPORT_LINES + code.slice(insertionIdx);
    break;
  }
}

if (!newCode) {
  // Fallback: add at the end
  newCode = code + IMPORT_LINES;
  console.log('⚠ No standard pattern found, appended to end of file');
}

fs.writeFileSync(mainFile, newCode);
console.log(`✓ Injected email route into ${mainFile}`);

// Step 5: Write backend .env with Brevo creds if API key provided
if (BREVO_API_KEY) {
  const envPath = path.join(BACKEND_DIR, '.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }
  const vars = {
    BREVO_API_KEY,
    SENDER_EMAIL: 'internshipofficecuiatd@gmail.com',
    SENDER_NAME: 'CUI-ATD',
  };
  let changed = false;
  for (const [key, val] of Object.entries(vars)) {
    const re = new RegExp(`^${key}=.*`, 'm');
    if (re.test(envContent)) {
      envContent = envContent.replace(re, `${key}=${val}`);
    } else {
      envContent += `\n${key}=${val}`;
    }
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(envPath, envContent.trimStart() + '\n');
    console.log('✓ Updated backend .env with Brevo credentials');
  }
}
