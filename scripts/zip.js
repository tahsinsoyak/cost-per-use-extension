import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zipName = 'cost-per-use-extension.zip';
const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const zipPath = path.join(projectRoot, zipName);

if (!fs.existsSync(distDir)) {
  console.error('Error: "dist" folder not found. Please run "npm run build" first.');
  process.exit(1);
}

console.log(`Packaging "${distDir}" to "${zipName}"...`);

try {
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  if (process.platform === 'win32') {
    // Use PowerShell's Compress-Archive on Windows
    const psCommand = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipPath}' -Force"`;
    execSync(psCommand, { stdio: 'inherit' });
  } else {
    // Use standard zip on Unix systems
    execSync(`cd "${distDir}" && zip -r "${zipPath}" ./*`, { stdio: 'inherit' });
  }
  console.log(`Successfully generated ${zipName}! Ready for upload to the Chrome Web Store.`);
} catch (error) {
  console.error('Failed to create zip archive:', error);
  process.exit(1);
}
