import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const distRoot = path.join(projectRoot, 'dist');

const requiredFiles = [
  'manifest.json',
  'index.html',
  'options.html',
  'assets/app.js',
  'assets/content.js',
  'assets/popup.js',
  'assets/options.js',
  'icons/icon16.png',
  'icons/icon32.png',
  'icons/icon48.png',
  'icons/icon128.png',
];

const requiredLocales = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'pt_BR', 'ru', 'tr', 'zh_CN'];

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const packageJson = await readJson(path.join(projectRoot, 'package.json'));
const manifest = await readJson(path.join(distRoot, 'manifest.json'));

assert(manifest.manifest_version === 3, 'The release package must use Manifest V3.');
assert(
  manifest.version === packageJson.version,
  `Version mismatch: package.json is ${packageJson.version}, but dist/manifest.json is ${manifest.version}.`,
);
assert(manifest.default_locale === 'en', 'The default Chrome locale must remain English.');
assert(!manifest.content_scripts, 'The release must not restore broad, always-on content scripts.');

for (const relativePath of requiredFiles) {
  await access(path.join(distRoot, relativePath));
}

for (const locale of requiredLocales) {
  const messages = await readJson(path.join(distRoot, '_locales', locale, 'messages.json'));
  assert(messages.extName?.message, `${locale} is missing extName.`);
  assert(messages.extDescription?.message, `${locale} is missing extDescription.`);
}

const manifestSize = (await stat(path.join(distRoot, 'manifest.json'))).size;

console.log(`Package validation passed for Cost Per Use v${manifest.version}.`);
console.log(`${requiredFiles.length} required files and ${requiredLocales.length} locales verified.`);
console.log(`Manifest size: ${manifestSize} bytes.`);
