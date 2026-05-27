const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frontend', 'src');

// Restore black → blue for accent/primary colors.
// Keep BLACK only for body text and minimal borders.
// BLUE = the primary brand color for sidebars, buttons, active states, accents.

const replacements = [
  // PRIMARY/SECONDARY → BLUE
  [/\b(bg-primary)\b/g, 'bg-blue-600'],
  [/\b(text-primary)\b/g, 'text-blue-600'],
  [/\b(border-primary)\b/g, 'border-blue-600'],
  [/\b(hover:bg-primary)\b/g, 'hover:bg-blue-700'],
  [/\b(hover:text-primary)\b/g, 'hover:text-blue-600'],

  [/\b(bg-secondary)\b/g, 'bg-blue-600'],
  [/\b(text-secondary)\b/g, 'text-blue-600'],
  [/\b(border-secondary)\b/g, 'border-blue-600'],
  [/\b(hover:bg-secondary)\b/g, 'hover:bg-blue-700'],
  [/\b(hover:text-secondary)\b/g, 'hover:text-blue-600'],

  // Sidebars and nav backgrounds that got turned black
  // Only replace bg-black where it's a primary container (sidebar, footer, banner)
  // Not where it's a subtle background like bg-black/5 or bg-black/10
  [/\b(bg-black)(?!\/)/g, 'bg-blue-600'],
  // But NOT bg-black with opacity (those are overlays)
  // Actually let me be more surgical - replace exact bg-black (not bg-black/xx)
  // This regex already handles that with the negative lookahead
  
  // bg-black/xx overlays → blue overlays
  [/\b(bg-black\/10)\b/g, 'bg-blue-600/10'],
  [/\b(bg-black\/20)\b/g, 'bg-blue-600/20'],
  [/\b(bg-black\/50)\b/g, 'bg-blue-600/50'],

  // Hover states from black → blue
  [/\b(hover:bg-black)(?!\/)/g, 'hover:bg-blue-700'],
  [/\b(hover:bg-black\/10)\b/g, 'hover:bg-blue-600/10'],
  [/\b(hover:text-black)\b/g, 'hover:text-blue-600'],
  [/\b(hover:border-black)\b/g, 'hover:border-blue-600'],

  // Active nav states
  [/\bgroup-hover:text-black\b/g, 'group-hover:text-blue-600'],

  // Link hover underline etc
  [/\b(hover:underline)\b.*?text-black/g, 'hover:underline text-blue-600'],

  // White/10, white/5 etc on dark backgrounds should be white (keep them)
  // But white/10 on blue bg is fine

  // Selection colors
  [/\bselection:bg-black\b/g, 'selection:bg-blue-600'],
  [/\bselection:text-white\b/g, 'selection:text-white'],

  // Shadows that went to blue should stay
  // But if any were cleared, restore
  [/\bshadow-black\b/g, 'shadow-blue-600'],

  // Focus ring
  [/\bfocus:ring-black\b/g, 'focus:ring-blue-600'],

  // Accent (checkbox etc)
  [/\baccent-black\b/g, 'accent-blue-600'],

  // Divide
  [/\bdivide-black\b/g, 'divide-blue-600'],

  // Button backgrounds that are bg-black
  // This catches things like `bg-black text-white` (buttons)
  [/\b(bg-black)(\s+text-white)\b/g, 'bg-blue-600$2'],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }

  // Also handle data object color strings
  // badgeColor text-black → text-blue-600 (for badges)
  // But NOT body text
  // This is tricky - only change text-black in badge/status contexts
  content = content.replace(/'(text-black)'/g, (match) => {
    // If the surrounding context suggests it's a badge/accent, use blue
    // Since we can't easily tell, default to blue for quoted strings
    return "'text-blue-600'";
  });

  // bg-white for card backgrounds etc is fine, keep as is
  // text-black for body content - keep some as black
  // Only change text-black in specific patterns:
  // - After labels: "font-bold text-black" → "font-bold text-blue-600" (headings)
  // - This is too aggressive so let's see
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let changed = 0;
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      changed += walkDir(fullPath);
    } else if (entry.name.endsWith('.jsx')) {
      process.stdout.write(`  ${path.relative(srcDir, fullPath)}... `);
      if (processFile(fullPath)) {
        changed++;
        console.log('FIXED');
      } else {
        console.log('OK');
      }
    }
  }
  return changed;
}

console.log('Pass 3: Replacing black accent colors with blue...\n');
const changed = walkDir(srcDir);
console.log(`\nDone! ${changed} files updated.`);
