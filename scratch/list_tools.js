const fs = require('fs');
const content = fs.readFileSync('d:/My Projects/tothewebpro/lib/tools-data.ts', 'utf8');

const regex = /slug:\s*"([^"]+)"/g;
let match;
const slugs = [];
while ((match = regex.exec(content)) !== null) {
  slugs.push(match[1]);
}
console.log('Total tools found in tools-data.ts:', slugs.length);
console.log(slugs);
