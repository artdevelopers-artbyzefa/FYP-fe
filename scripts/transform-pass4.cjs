const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frontend', 'src');

const iconMap = {
  'fa-times': 'X', 'fa-eye': 'Eye', 'fa-eye-slash': 'EyeOff',
  'fa-chevron-left': 'ChevronLeft', 'fa-chevron-right': 'ChevronRight',
  'fa-spinner': 'Loader', 'fa-save': 'Save', 'fa-arrow-right': 'ArrowRight',
  'fa-search': 'Search', 'fa-clock': 'Clock', 'fa-exclamation-circle': 'AlertCircle',
  'fa-file-powerpoint': 'Presentation', 'fa-file-word': 'FileText', 'fa-file-pdf': 'FileText',
  'fa-lock': 'Lock', 'fa-lock-open': 'LockOpen',
  'fa-github': 'Github', 'fa-linkedin-in': 'Linkedin',
  'fa-circle-check': 'CheckCircle',
  'fa-book-open': 'BookOpen', 'fa-list-check': 'ListChecks', 'fa-chart-simple': 'BarChart',
  'fa-users': 'Users', 'fa-award': 'Award', 'fa-code': 'Code',
  'fa-user-tie': 'User', 'fa-file-pen': 'FileEdit', 'fa-lightbulb': 'Lightbulb',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  const newIcons = new Set();

  // 1. Handle <i className={`fas ${cond ? 'fa-xxx' : 'fa-yyy'} ...`}></i> patterns (ternary conditional)
  content = content.replace(/<i\s+className=\{`fas\s+\$\{(.*?)\?(?:\s*'fa-([a-z0-9-]+)'\s*:\s*'fa-([a-z0-9-]+)')\}([^`]*)`\}><\/i>/g, (match, condition, iconA, iconB, rest) => {
    const nameA = iconMap['fa-' + iconA];
    const nameB = iconMap['fa-' + iconB];
    if (!nameA || !nameB) { console.log(`  NO MAP: fa-${iconA} / fa-${iconB}`); return match; }
    newIcons.add(nameA); newIcons.add(nameB);
    return `{${condition} ? <${nameA} className="w-4 h-4" /> : <${nameB} className="w-4 h-4" />}`;
  });

  // 2. Handle the specific ternary patterns with different structures
  // `<i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-arrow-right'}`}></i>`
  content = content.replace(/<i\s+className=\{`fas\s+\$\{loading\s*\?\s*'fa-spinner\s*fa-spin'\s*:\s*'fa-([a-z0-9-]+)'\}`\}\s*><\/i>/g, (match, iconA) => {
    const nameA = iconMap['fa-' + iconA];
    if (!nameA) return match;
    newIcons.add(nameA); newIcons.add('Loader');
    return `{loading ? <Loader className="w-4 h-4 animate-spin" /> : <${nameA} className="w-4 h-4" />}`;
  });

  // `<i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'} mr-2`}></i>`
  content = content.replace(/<i\s+className=\{`fas\s+\$\{loading\s*\?\s*'fa-spinner\s*fa-spin'\s*:\s*'fa-([a-z0-9-]+)'\}([^`]*)`\}><\/i>/g, (match, iconA, rest) => {
    const nameA = iconMap['fa-' + iconA];
    if (!nameA) return match;
    newIcons.add(nameA); newIcons.add('Loader');
    return `{loading ? <Loader className="w-4 h-4 animate-spin${rest}" /> : <${nameA} className="w-4 h-4${rest}" />}`;
  });

  // `<i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>`
  content = content.replace(/<i\s+className=\{`fas\s+\$\{(\w+)\s*\?\s*'fa-([a-z0-9-]+)'\s*:\s*'fa-([a-z0-9-]+)'\}([^`]*)`\}><\/i>/g, (match, cond, iconA, iconB, rest) => {
    const nameA = iconMap['fa-' + iconA];
    const nameB = iconMap['fa-' + iconB];
    if (!nameA || !nameB) return match;
    newIcons.add(nameA); newIcons.add(nameB);
    return `{${cond} ? <${nameA} className="w-4 h-4" /> : <${nameB} className="w-4 h-4" />}`;
  });

  // 3. Static FA close buttons: <i className="fas fa-times text-black hover:text-blue-600 cursor-pointer text-lg" ...></i>
  content = content.replace(/<i\s+className="fas\s+fa-times\s*([^"]*?)"\s*([^>]*)><\/i>/g, (match, classes, attrs) => {
    newIcons.add('X');
    return `<X className="w-4 h-4 cursor-pointer" ${attrs} />`;
  });

  // 4. Static FA icons with various other classes
  content = content.replace(/<i\s+className="fas\s+fa-([a-z0-9-]+)\s*([^"]*?)"\s*>([\s\S]*?)<\/i>/g, (match, faIcon, classes) => {
    const lucideName = iconMap['fa-' + faIcon];
    if (!lucideName) { console.log(`  REMAINING: fa-${faIcon}`); return match; }
    newIcons.add(lucideName);
    return `<${lucideName} className="w-4 h-4 ${classes}" />`;
  });

  // Self-closing
  content = content.replace(/<i\s+className="fas\s+fa-([a-z0-9-]+)\s*([^"]*?)"\s*\/>/g, (match, faIcon, classes) => {
    const lucideName = iconMap['fa-' + faIcon];
    if (!lucideName) { console.log(`  REMAINING: fa-${faIcon}`); return match; }
    newIcons.add(lucideName);
    return `<${lucideName} className="w-4 h-4 ${classes}" />`;
  });

  // 5. Handle `fab` icons (brand icons): <i className="fab fa-github"></i>
  content = content.replace(/<i\s+className="fab\s+fa-([a-z0-9-]+)"\s*><\/i>/g, (match, faIcon) => {
    const lucideName = iconMap['fa-' + faIcon];
    if (!lucideName) { return match; }
    newIcons.add(lucideName);
    return `<${lucideName} className="w-4 h-4" />`;
  });

  // 6. Handle data object icon strings: icon: "fa-xxx"
  content = content.replace(/icon:\s*"(fa-[a-z0-9-]+)"/g, (match, faIcon) => {
    const lucideName = iconMap[faIcon];
    if (!lucideName) { console.log(`  DATA ICON: ${faIcon}`); return match; }
    newIcons.add(lucideName);
    return `icon: ${lucideName}`;
  });

  // 7. Handle dynamic nav pattern: `<i className={`fas fa-${n.icon}`}></i>`
  content = content.replace(/<i\s+className=\{`fas\s+fa-\$\{n\.icon`}\}\s*><\/i>/g, () => {
    newIcons.add('createElement');
    return '{React.createElement(n.icon, { className: "w-4 h-4" })}';
  });
  content = content.replace(/<i\s+className=\{`fas\s+fa-\$\{n\.icon`}\}\s*\/>/g, () => {
    newIcons.add('createElement');
    return '{React.createElement(n.icon, { className: "w-4 h-4" })}';
  });

  // Handle another dynamic pattern
  content = content.replace(/<i\s+className=\{`fas\s+fa-\$\{item\.icon`}\}\s*\/>/g, () => {
    newIcons.add('createElement');
    return '{React.createElement(item.icon, { className: "w-4 h-4" })}';
  });

  // 8. Handle <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i>
  content = content.replace(/<i\s+className=\{`fas\s+\$\{(\w+)\s*\?\s*'fa-chevron-right'\s*:\s*'fa-chevron-left'\}([^`]*)`\}><\/i>/g, (match, varName, rest) => {
    newIcons.add('ChevronRight'); newIcons.add('ChevronLeft');
    return `{${varName} ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}`;
  });

  // 9. Handle <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i> (similar pattern with isCollapsed)
  content = content.replace(/<i\s+className=\{`fas\s+\$\{(\w+)\s*\?\s*'fa-chevron-right'\s*:\s*'fa-chevron-left'\}([^`]*)`\}><\/i>/g, (match, varName, rest) => {
    newIcons.add('ChevronRight'); newIcons.add('ChevronLeft');
    return `{${varName} ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}`;
  });

  // 10. Handle text-blue (no shade) → text-blue-600
  content = content.replace(/\btext-blue(?!-|[a-z])/g, 'text-blue-600');
  content = content.replace(/\bbg-blue(?!-|[a-z])/g, 'bg-blue-600');
  content = content.replace(/\bhover:bg-blue(?!-|[a-z])/g, 'hover:bg-blue-600');
  content = content.replace(/\bgroup-hover:bg-blue(?!-|[a-z])/g, 'group-hover:bg-blue-600');
  content = content.replace(/\bhover:text-blue(?!-|[a-z])/g, 'hover:text-blue-600');
  content = content.replace(/\bborder-blue(?!-|[a-z])/g, 'border-blue-600');

  // 11. Remove fa-spin and replace with animate-spin on Loader
  content = content.replace(/fa-spin/g, 'animate-spin');

  // 12. Replace bg-lightbg → bg-white
  content = content.replace(/\bbg-lightbg\b/g, 'bg-white');

  // 13. Check for React import
  let needsReact = content.includes('React.createElement') && !content.includes("import React") && !content.includes("import * as React");
  
  // Add import
  if (newIcons.size > 0) {
    const validIcons = Array.from(newIcons)
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
        const importLines = content.match(/^import .+?;$/gm);
        if (importLines && importLines.length > 0) {
          const lastImport = importLines[importLines.length - 1];
          content = content.replace(lastImport, lastImport + '\n' + importStatement.trim());
        }
      }
    }
  }

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

console.log('Pass 4: Fixing all remaining FA icons, emojis, and colors...\n');
const changed = walkDir(srcDir);
console.log(`\nDone! ${changed} files fixed.`);
