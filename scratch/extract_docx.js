const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Since docx is a zip file, let's extract word/document.xml using child_process powershell Expand-Archive or tar
const { execSync } = require('child_process');

try {
  const tempDir = path.join(__dirname, 'docx_temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  const docxPath = 'd:\\My Projects\\tothewebpro\\public\\blog\\ToTheWebPro-Tool-Pages-SEO-Content.docx';
  execSync(`tar -xf "${docxPath}" -C "${tempDir}"`);

  const xmlPath = path.join(tempDir, 'word', 'document.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  // Replace <w:p> tags with newlines and remove all xml tags
  const text = xmlContent
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<[^>]+>/g, '');

  fs.writeFileSync(path.join(__dirname, 'docx_content.txt'), text, 'utf8');
  console.log('Successfully extracted docx content!');
  console.log(text.slice(0, 3000));
} catch (err) {
  console.error(err);
}
