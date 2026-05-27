const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, '..', 'frontend', 'src');

function walkDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let changed = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { changed += walkDir(full); }
    else if (entry.name.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      const orig = content;
      content = content.replace(/hover:bg-red-500\/20 hover:text-red-400/g, 'hover:bg-blue-600/20 hover:text-blue-600');
      content = content.replace(/text-yellow-400/g, 'text-black');
      content = content.replace(/shadow-\[\#2563eb\]\/20/g, 'shadow-blue-600/20');
      if (content !== orig) {
        fs.writeFileSync(full, content);
        changed++;
      }
    }
  }
  return changed;
}

console.log(`Fixed ${walkDir(srcDir)} files`);
