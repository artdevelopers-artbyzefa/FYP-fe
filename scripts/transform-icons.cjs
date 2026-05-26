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

const colorReplacements = [
  // Gradient-related classes
  [/from-(?:[a-z]+)(?:-\d+)?/g, ''],
  [/via-(?:[a-z]+)(?:-\d+)?/g, ''],
  [/to-(?:[a-z]+)(?:-\d+)?/g, ''],
  [/bg-gradient-to-[a-z]+/g, ''],
  // Non-white/blue/black colors -> blue
  [/\btext-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?(?:\/[a-z0-9]+)?\b/g, 'text-black'],
  [/\bhover:text-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?\b/g, 'hover:text-black'],
  [/\bgroup-hover:text-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?\b/g, 'group-hover:text-black'],
  [/\bbg-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:\/\d+)?(?:-\d+)?\b/g, 'bg-white'],
  [/\bhover:bg-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:\/\d+)?(?:-\d+)?\b/g, 'hover:bg-white'],
  [/\bborder-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?\b/g, 'border-black'],
  [/\bhover:border-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?\b/g, 'hover:border-black'],
  [/\bshadow-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?(?:\/[a-z0-9]+)?\b/g, ''],
  [/\bfocus:ring-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?\b/g, 'focus:ring-black'],
  [/\baccent-(?:amber|emerald|purple|green|red|yellow|indigo|pink|teal|cyan|rose|violet|orange|secondary|success|danger|warning|info)(?:-\d+)?\b/g, 'accent-black'],
  // Gray/slate/neutral -> black or white
  [/\btext-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'text-black'],
  [/\bhover:text-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'hover:text-black'],
  [/\bgroup-hover:text-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'group-hover:text-black'],
  [/\bbg-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'bg-white'],
  [/\bhover:bg-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'hover:bg-white'],
  [/\bborder-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'border-black'],
  [/\bhover:border-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'hover:border-black'],
  [/\bdivide-(?:gray|slate|stone|neutral|zinc)(?:-\d+)?\b/g, 'divide-black'],
  // Blue shades -> black/white
  [/\btext-blue-(\d+)\b/g, 'text-black'],
  [/\bhover:text-blue-(\d+)\b/g, 'hover:text-black'],
  [/\bgroup-hover:text-blue-(\d+)\b/g, 'group-hover:text-black'],
  [/\bbg-blue-(\d+)\b/g, (m, d) => parseInt(d) >= 500 ? 'bg-black' : 'bg-white'],
  [/\bhover:bg-blue-(\d+)\b/g, (m, d) => parseInt(d) >= 500 ? 'hover:bg-black' : 'hover:bg-white'],
  [/\bborder-blue-(\d+)\b/g, 'border-black'],
  [/\bhover:border-blue-(\d+)\b/g, 'hover:border-black'],
  [/\bshadow-blue-\d+\/[a-z0-9]+\b/g, ''],
  // Primary/navy -> black
  [/\btext-primary\b/g, 'text-black'],
  [/\bhover:text-primary\b/g, 'hover:text-black'],
  [/\bbg-primary\b/g, 'bg-black'],
  [/\bhover:bg-primary\b/g, 'hover:bg-black'],
  [/\bborder-primary\b/g, 'border-black'],
  [/\bhover:border-primary\b/g, 'hover:border-black'],
  // lightbg -> white
  [/\bbg-lightbg\b/g, 'bg-white'],
  // white/10 white/5 etc -> keep
  // selection colors
  [/\bselection:bg-(?:[a-z]+)(?:-\d+)?(?:\/[a-z0-9]+)?\b/g, 'selection:bg-black'],
  [/\bselection:text-(?:[a-z]+)(?:-\d+)?\b/g, 'selection:text-white'],
];

const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FB}\u{25FC}\u{25FD}\u{25FE}\u{2B05}\u{2B06}\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;

function applyColorReplacements(str) {
  if (!str || (typeof str !== 'string')) return str;
  let result = str;
  for (const [regex, replacement] of colorReplacements) {
    result = result.replace(regex, replacement);
  }
  // Clean up double spaces
  result = result.replace(/\s{2,}/g, ' ');
  return result.trim();
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  const iconsUsed = new Set();

  // 1. Replace static FA icons: <i className="...fas fa-xxx...">...</i>
  // Handle <i className="...fas fa-xxx ...">content</i>
  content = content.replace(/<i\s+className="([^"]*?)fas\s+(fa-[a-z0-9-]+)([^"]*?)"\s*>([\s\S]*?)<\/i>/g, (match, prefix, faIcon, suffix) => {
    const lucideName = iconMap[faIcon];
    if (!lucideName) { console.log(`  NO MAP: ${faIcon}`); return match; }
    iconsUsed.add(lucideName);
    let cls = applyColorReplacements(prefix + ' ' + suffix);
    if (!cls.includes('w-') && !cls.includes('h-') && !cls.includes('text-')) cls = 'w-4 h-4 ' + cls;
    return `<${lucideName} className="${cls}" />`;
  });

  // Self-closing: <i className="...fas fa-xxx..." />
  content = content.replace(/<i\s+className="([^"]*?)fas\s+(fa-[a-z0-9-]+)([^"]*?)"\s*\/>/g, (match, prefix, faIcon, suffix) => {
    const lucideName = iconMap[faIcon];
    if (!lucideName) { console.log(`  NO MAP: ${faIcon}`); return match; }
    iconsUsed.add(lucideName);
    let cls = applyColorReplacements(prefix + ' ' + suffix);
    if (!cls.includes('w-') && !cls.includes('h-') && !cls.includes('text-')) cls = 'w-4 h-4 ' + cls;
    return `<${lucideName} className="${cls}" />`;
  });

  // Handle conditional icon rendering: {item.icon && <i className={`fas ${item.icon}`} />}
  content = content.replace(/\{(item|link)\.icon\s*&&\s*<i\s+className=\{`fas\s+\$\{(item|link)\.icon`}\}\s*\/>\}/g, (match) => {
    return '{React.createElement(icon, { className: "w-4 h-4" })}';
  });

  // 2. Replace icon references in data objects: icon: 'fa-xxx'
  content = content.replace(/icon:\s*'(fa-[a-z0-9-]+)'/g, (match, faIcon) => {
    const lucideName = iconMap[faIcon];
    if (!lucideName) { console.log(`  NO MAP (obj): ${faIcon}`); return match; }
    iconsUsed.add(lucideName);
    return `icon: ${lucideName}`;
  });

  // 3. Replace dynamic icon rendering: <i className={`fas ${item.icon}`}></i>
  content = content.replace(/<i\s+className=\{`fas\s+\$\{item\.icon`}\}\s*>([\s\S]*?)<\/i>/g, () => '{React.createElement(item.icon, { className: "w-4 h-4" })}');
  content = content.replace(/<i\s+className=\{`fas\s+\$\{item\.icon`}\}\s*\/>/g, () => '{React.createElement(item.icon, { className: "w-4 h-4" })}');
  content = content.replace(/<i\s+className=\{`fas\s+\$\{icon`}\}\s*\/>/g, () => '{React.createElement(icon, { className: "w-4 h-4" })}');

  // 4. Remove emojis
  content = content.replace(emojiRegex, '');

  // 5. Apply color replacements to className strings
  content = content.replace(/className="([^"]*)"/g, (match, cls) => {
    const normalized = applyColorReplacements(cls);
    return normalized !== cls ? `className="${normalized}"` : match;
  });

  // Handle gradient style props
  content = content.replace(/style=\{(\{[^}]*background[^}]*\})\}/g, (match) => {
    if (match.includes('gradient') || match.includes('linear-gradient')) return '';
    return match;
  });

  // Remove empty brackets from style removal
  content = content.replace(/ style=\{\}/g, '');

  // 6. Add import
  if (iconsUsed.size > 0) {
    const needsCreateElement = iconsUsed.has('createElement');
    
    // Filter out invalid imports
    const validIcons = Array.from(iconsUsed)
      .filter(name => name !== 'createElement' && name !== 'React')
      .sort();
    
    if (validIcons.length > 0) {
      const importStatement = `import { ${validIcons.join(', ')} } from 'lucide-react';\n`;
      
      if (content.includes("from 'lucide-react'")) {
        const existingImportRegex = /import \{ ([^}]+) \} from 'lucide-react'/;
        const existingMatch = content.match(existingImportRegex);
        if (existingMatch) {
          const existingIcons = existingMatch[1].split(',').map(s => s.trim()).filter(s => s);
          const allIcons = Array.from(new Set([...existingIcons, ...validIcons])).sort();
          content = content.replace(existingImportRegex, `import { ${allIcons.join(', ')} } from 'lucide-react'`);
        }
      } else {
        // Find last import line
        const importLines = content.match(/^import .+?;$/gm);
        if (importLines && importLines.length > 0) {
          const lastImport = importLines[importLines.length - 1];
          content = content.replace(lastImport, lastImport + '\n' + importStatement.trim());
        }
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let changed = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      changed += walkDir(fullPath);
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      process.stdout.write(`  ${path.relative(srcDir, fullPath)}... `);
      if (processFile(fullPath)) {
        changed++;
        console.log('OK');
      } else {
        console.log('-');
      }
    }
  }
  return changed;
}

console.log('Starting transformation...\n');
const changed = walkDir(srcDir);
console.log(`\nDone! ${changed} files modified.`);
