const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frontend', 'src');
const iconMap = {
  'fa-users': 'Users', 'fa-gavel': 'Gavel', 'fa-chalkboard-teacher': 'Presentation',
  'fa-check-circle': 'CheckCircle', 'fa-check': 'Check', 'fa-check-double': 'CheckCheck',
  'fa-chevron-right': 'ChevronRight', 'fa-chevron-left': 'ChevronLeft', 'fa-chevron-down': 'ChevronDown',
  'fa-envelope': 'Mail', 'fa-lock': 'Lock', 'fa-lock-open': 'LockOpen',
  'fa-eye': 'Eye', 'fa-eye-slash': 'EyeOff',
  'fa-arrow-right': 'ArrowRight', 'fa-arrow-left': 'ArrowLeft',
  'fa-bell': 'Bell', 'fa-bars': 'Menu',
  'fa-times': 'X', 'fa-times-circle': 'XCircle',
  'fa-search': 'Search', 'fa-magnifying-glass': 'Search',
  'fa-plus': 'Plus', 'fa-trash': 'Trash2', 'fa-edit': 'Pencil',
  'fa-download': 'Download', 'fa-upload': 'Upload', 'fa-save': 'Save',
  'fa-print': 'Printer', 'fa-home': 'Home', 'fa-user': 'User',
  'fa-user-circle': 'UserCircle', 'fa-graduation-cap': 'GraduationCap',
  'fa-calendar-alt': 'Calendar', 'fa-calendar-check': 'CalendarCheck',
  'fa-clock': 'Clock', 'fa-phone': 'Phone',
  'fa-map-marker-alt': 'MapPin', 'fa-location-dot': 'MapPin',
  'fa-star': 'Star', 'fa-star-half-alt': 'StarHalf',
  'fa-info-circle': 'Info', 'fa-circle-info': 'Info',
  'fa-exclamation-circle': 'AlertCircle', 'fa-exclamation-triangle': 'AlertTriangle',
  'fa-triangle-exclamation': 'AlertTriangle',
  'fa-book': 'Book', 'fa-book-open': 'BookOpen',
  'fa-tasks': 'ClipboardList', 'fa-clipboard-check': 'ClipboardCheck',
  'fa-file-alt': 'FileText', 'fa-file-lines': 'FileText', 'fa-file-word': 'FileText',
  'fa-file-invoice': 'File', 'fa-file-export': 'FileUp', 'fa-file-upload': 'FileUp',
  'fa-file-pen': 'FileEdit', 'fa-file-pdf': 'FileText',
  'fa-file-powerpoint': 'Presentation', 'fa-file-signature': 'FileSignature',
  'fa-folder-open': 'FolderOpen', 'fa-tag': 'Tag', 'fa-tags': 'Tags',
  'fa-user-cog': 'UserCog', 'fa-user-plus': 'UserPlus',
  'fa-user-shield': 'Shield', 'fa-user-edit': 'UserPen',
  'fa-user-graduate': 'GraduationCap', 'fa-user-tie': 'User',
  'fa-landmark': 'Landmark', 'fa-university': 'Landmark',
  'fa-shield-alt': 'Shield', 'fa-database': 'Database', 'fa-server': 'Server',
  'fa-tools': 'Wrench', 'fa-history': 'History', 'fa-sync-alt': 'RefreshCw',
  'fa-crown': 'Crown', 'fa-award': 'Award', 'fa-lightbulb': 'Lightbulb',
  'fa-comments': 'MessageSquare', 'fa-paper-plane': 'Send',
  'fa-inbox': 'Inbox', 'fa-bullhorn': 'Megaphone', 'fa-code': 'Code',
  'fa-robot': 'Bot', 'fa-chart-bar': 'BarChart3', 'fa-chart-line': 'LineChart',
  'fa-chart-pie': 'PieChart', 'fa-chart-simple': 'BarChart',
  'fa-layer-group': 'Layers', 'fa-cloud-download-alt': 'CloudDownload',
  'fa-cloud-upload-alt': 'CloudUpload', 'fa-broom': 'Broom',
  'fa-laptop-file': 'Laptop', 'fa-paperclip': 'Paperclip',
  'fa-headset': 'Headphones', 'fa-github': 'Github', 'fa-linkedin-in': 'Linkedin',
  'fa-route': 'Route', 'fa-scale-balanced': 'Scale', 'fa-balance-scale': 'Scale',
  'fa-balance-scale-right': 'Scale', 'fa-right-from-bracket': 'LogOut',
  'fa-reply': 'Reply', 'fa-circle': 'Circle', 'fa-circle-question': 'HelpCircle',
  'fa-cake-candles': 'Cake', 'fa-camera': 'Camera',
  'fa-ellipsis-v': 'MoreVertical', 'fa-external-link-alt': 'ExternalLink',
  'fa-id-card': 'IdCard', 'fa-level-up-alt': 'ArrowUpToLine',
  'fa-list-check': 'ListChecks', 'fa-project-diagram': 'GitBranch',
  'fa-toggle-on': 'ToggleRight', 'fa-users-gear': 'Users',
  'fa-users-rectangle': 'Users', 'fa-users-viewfinder': 'Users',
  'fa-spinner': 'Loader', 'fa-bread-slice': 'Bread',
  'fa-shield-halved': 'Shield',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  const newIcons = new Set();

  // 1. Fix template literal <i className={`fas ${xxxx}`}>...</i> patterns
  // Pattern: `<i className={`fas ${someVar} ...`}>...</i>` 
  content = content.replace(/<i\s+className=\{`fas\s+\$\{(link|item|icon|card)\.?(icon)?\}([^`]*)`\}\s*>([\s\S]*?)<\/i>/g, (match, base, field) => {
    const varName = field ? `${base}.${field}` : base;
    return `{React.createElement(${varName}, { className: "w-4 h-4" })}`;
  });

  // Also handle `<i className={`fas ${var}`}/>` self-closing
  content = content.replace(/<i\s+className=\{`fas\s+\$\{(link|item|icon|card)\.?(icon)?\}([^`]*)`\}\s*\/>/g, (match, base, field) => {
    const varName = field ? `${base}.${field}` : base;
    return `{React.createElement(${varName}, { className: "w-4 h-4" })}`;
  });

  // 2. Fix template literal with hardcoded fa-xxx inside backtick
  // Pattern: `<i className={`fas fa-xxx ...`}>...</i>`
  content = content.replace(/<i\s+className=\{`fas\s+(fa-[a-z0-9-]+)([^`]*)`\}\s*>([\s\S]*?)<\/i>/g, (match, faIcon, rest) => {
    const lucideName = iconMap[faIcon];
    if (!lucideName) { console.log(`  NO MAP (tmpl): ${faIcon}`); return match; }
    newIcons.add(lucideName);
    return `<${lucideName} className="w-4 h-4" />`;
  });
  content = content.replace(/<i\s+className=\{`fas\s+(fa-[a-z0-9-]+)([^`]*)`\}\s*\/>/g, (match, faIcon, rest) => {
    const lucideName = iconMap[faIcon];
    if (!lucideName) { console.log(`  NO MAP (tmpl): ${faIcon}`); return match; }
    newIcons.add(lucideName);
    return `<${lucideName} className="w-4 h-4" />`;
  });

  // 3. Replace bg-primary / bg-secondary / text-primary / text-secondary in className strings
  content = content.replace(/\b(bg-(?:primary|secondary))\b/g, 'bg-black');
  content = content.replace(/\b(text-(?:primary|secondary))\b/g, 'text-black');
  content = content.replace(/\b(border-(?:primary|secondary))\b/g, 'border-black');
  content = content.replace(/\b(hover:bg-(?:primary|secondary))\b/g, 'hover:bg-black');
  content = content.replace(/\b(hover:text-(?:primary|secondary))\b/g, 'hover:text-black');
  content = content.replace(/\b(hover:border-(?:primary|secondary))\b/g, 'hover:border-black');

  // 4. Replace gradient inline styles
  content = content.replace(/style=\{\{background:\s*'linear-gradient[^}]*\}\}/g, '');
  content = content.replace(/style=\{\{background:\s*`linear-gradient[^}]*`\}\}/g, '');

  // 5. Replace color strings in data objects (like badgeColor, bgLight, color, hover, etc.)
  // These are JS string values like 'text-amber-700 bg-amber-50' or 'from-xxx to-xxx'
  content = content.replace(/'(text-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange)[^']*)'/g, "'text-black'");
  content = content.replace(/'(bg-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange)[^']*)'/g, "'bg-white'");
  content = content.replace(/'(border-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange)[^']*)'/g, "'border-black'");
  content = content.replace(/'(hover:(?:text|bg|border)-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange)[^']*)'/g, "'hover:text-black hover:bg-white hover:border-black'");
  content = content.replace(/'(shadow-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange)[^']*)'/g, "''");
  // Gradient strings in objects
  content = content.replace(/'(from-(?:[a-z]+)(?:-\d+)?\s+to-(?:[a-z]+)(?:-\d+)?)'/g, "''");
  content = content.replace(/'(bg-gradient-to-[a-z]+[^']*)'/g, "''");
  // bgLight type strings
  content = content.replace(/'(bg-(?:gray|slate|blue|amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange)(?:\/\d+)?(?:-\d+)?)'/g, "'bg-white'");

  // 6. Remove empty style props
  content = content.replace(/\s+style=\{\s*\}/g, '');

  // 7. Handle remaining inline gradient references in template literals
  content = content.replace(/`[^`]*bg-gradient-to-[a-z]+[^`]*`/g, (match) => {
    return match.replace(/bg-gradient-to-[a-z]+/g, '').replace(/from-[a-z0-9-]+/g, '').replace(/to-[a-z0-9-]+/g, '').replace(/\s+/g, ' ').trim();
  });

  // 8. Add import for createElement if React.createElement is used but React isn't imported
  if (content.includes('React.createElement') && !content.includes("import React") && !content.includes("import * as React")) {
    content = "import React from 'react';\n" + content;
  }

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

console.log('Starting pass 2 - fixing remaining patterns...\n');
const changed = walkDir(srcDir);
console.log(`\nDone! ${changed} files fixed.`);
