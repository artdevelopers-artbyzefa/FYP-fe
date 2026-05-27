const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frontend', 'src');

// Targeted fixes for remaining <i> tags that have attributes with >
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  let hasChanges = false;
  const newIcons = new Set();

  // 1. Fix all remaining <i className="fas fa-times ...">  (close buttons with onClick etc)
  // These have attributes containing > which makes regex tricky.
  // Strategy: replace the opening <i tag with <X and keep all attributes, change closing </i>
  if (content.includes('fas fa-times')) {
    // Replace: <i className="fas fa-times ..." onClick={...}></i>
    // With: <X className="w-4 h-4 cursor-pointer" onClick={...} />
    let c = content;
    // Use a non-greedy match that stops at </i>
    const regex = /<i\s+className="fas\s+fa-times\s*([^"]*?)"\s*([\s\S]*?)><\/i>/g;
    c = c.replace(regex, (match, classes, attrs) => {
      newIcons.add('X');
      // Clean up old color classes from classes string
      let cleanClasses = classes.replace(/text-black/g, '').replace(/hover:text-blue-600/g, '').trim();
      if (!cleanClasses.includes('w-') && !cleanClasses.includes('h-')) cleanClasses = 'w-4 h-4 cursor-pointer ' + cleanClasses;
      return `<X className="${cleanClasses.trim()}" ${attrs} />`;
    });
    if (c !== content) {
      content = c;
      hasChanges = true;
    }
  }

  // 2. Fix fa-lock and fa-lock-open static icons
  for (const [faIcon, lucideName] of [['fa-lock', 'Lock'], ['fa-lock-open', 'LockOpen']]) {
    if (content.includes(faIcon)) {
      const re = new RegExp(`<i\\s+className="fas\\s+${faIcon}\\s*([^"]*?)"\\s*([^>]*)><\\/i>`, 'g');
      let c = content.replace(re, (match, classes, attrs) => {
        newIcons.add(lucideName);
        let clean = classes.replace(/text-black/g, '').trim();
        if (!clean.includes('w-') && !clean.includes('h-')) clean = 'w-4 h-4 ' + clean;
        return `<${lucideName} className="${clean.trim()}" ${attrs} />`;
      });
      if (c !== content) {
        content = c;
        hasChanges = true;
      }
    }
  }

  // 3. Fix dynamic nav: <i className={`fas fa-${n.icon}`}></i>
  if (content.includes('fas fa-${n.icon') || content.includes("fas fa-${n.icon") || content.includes('`fas fa-${n.icon}')) {
    let c = content;
    // Match template literal patterns with ${n.icon}
    c = c.replace(/<i\s+className=\{`fas\s+fa-\$\{n\.icon`}\}\s*><\/i>/g, () => {
      newIcons.add('createElement');
      return '{React.createElement(n.icon, { className: "w-4 h-4" })}';
    });
    c = c.replace(/<i\s+className=\{`fas\s+fa-\$\{item\.icon`}\}\s*><\/i>/g, () => {
      newIcons.add('createElement');
      return '{React.createElement(item.icon, { className: "w-4 h-4" })}';
    });
    // Also handle the nav data objects to use component refs
    // e.g., icon: 'pie-chart' → icon: PieChart
    // Check if file also has nav link definitions with icon strings
    c = c.replace(/icon:\s*'([a-z-]+)'/g, (match, iconName) => {
      // Map common icon names to Lucide components
      const iconMap = {
        'dashboard': 'LayoutDashboard', 'users': 'Users', 'roles': 'Shield',
        'phases': 'GitBranch', 'settings': 'Settings', 'maintenance': 'Wrench',
        'logs': 'History', 'committees': 'Users', 'evaluations': 'ClipboardCheck',
        'proposals': 'FileText', 'groups': 'Users', 'supervision': 'Presentation',
        'availability': 'Calendar', 'profile': 'User', 'projects': 'FolderOpen',
        'scoring': 'Star', 'messages': 'MessageSquare', 'complaints': 'AlertCircle',
        'grievances': 'Gavel', 'reports': 'BarChart3', 'students': 'GraduationCap',
        'faculty': 'Presentation', 'notifications': 'Bell', 'tasks': 'ClipboardList',
        'calendar': 'Calendar', 'announcements': 'Megaphone', 'resources': 'Book',
        'templates': 'FileText', 'archive': 'Archive', 'analytics': 'LineChart',
        'overview': 'LayoutDashboard', 'guide': 'BookOpen', 'faq': 'HelpCircle',
      };
      const lucideName = iconMap[iconName] || null;
      if (lucideName) {
        newIcons.add(lucideName);
        return `icon: ${lucideName}`;
      }
      return match;
    });
    if (c !== content) {
      content = c;
      hasChanges = true;
    }
  }

  // 4. Fix remaining icon data strings like 'fa-file-powerpoint'
  // These appear in template literals like `${c.id === 'PT' ? 'fa-file-powerpoint' : ...}`
  if (content.includes("'fa-file-powerpoint'") || content.includes("'fa-file-word'") || content.includes("'fa-file-pdf'")) {
    let c = content;
    c = c.replace(/'fa-file-powerpoint'/g, () => { newIcons.add('Presentation'); return '<Presentation className="w-4 h-4" />'; });
    c = c.replace(/'fa-file-word'/g, () => { newIcons.add('FileText'); return '<FileText className="w-4 h-4" />'; });
    c = c.replace(/'fa-file-pdf'/g, () => { newIcons.add('FileText'); return '<FileText className="w-4 h-4" />'; });
    if (c !== content) {
      content = c;
      hasChanges = true;
    }
  }

  // 5. Fix Login.jsx remaining icon: <i className={`fas ${isLoading ? 'animate-spinner animate-spin' : 'fa-arrow-right'}`}></i>
  if (content.includes('animate-spinner')) {
    let c = content;
    c = c.replace(/<i\s+className=\{`fas\s+\$\{isLoading\s*\?\s*'animate-spinner\s*animate-spin'\s*:\s*'fa-arrow-right'`}\}\s*><\/i>/g, () => {
      newIcons.add('Loader'); newIcons.add('ArrowRight');
      return '{isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}';
    });
    if (c !== content) {
      content = c;
      hasChanges = true;
    }
  }

  // Add imports
  if (newIcons.size > 0) {
    const validIcons = Array.from(newIcons).filter(n => n !== 'createElement').sort();
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
        const importLines = content.match(/^import .+?;$/gm);
        if (importLines && importLines.length > 0) {
          const lastImport = importLines[importLines.length - 1];
          content = content.replace(lastImport, lastImport + '\n' + importStatement.trim());
        }
      }
    }
  }
  
  // Check for React import needed
  let needsReact = content.includes('React.createElement') && !content.includes("import React") && !content.includes("import * as React");
  if (needsReact) {
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

console.log('Pass 5: Fixing remaining <i> tags with attributes containing >\n');
const changed = walkDir(srcDir);
console.log(`\nDone! ${changed} files fixed.`);
