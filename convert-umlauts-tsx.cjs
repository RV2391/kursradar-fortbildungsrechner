#!/usr/bin/env node
/**
 * Runs the KursRadar umlaut converter on .tsx/.ts files in src/
 * Reuses the dictionary from the launch converter.
 */

const fs = require('fs');
const path = require('path');

// Load converter source and extract dictionary
const converterPath = path.resolve(process.env.HOME || process.env.USERPROFILE, 'kursradar/code/kursradar-designs/launch/convert-umlauts.js');
const converterSource = fs.readFileSync(converterPath, 'utf-8');
const dictMatch = converterSource.match(/const DICTIONARY = \{([\s\S]*?)\n\};/);
if (!dictMatch) { console.log('DICTIONARY not found'); process.exit(1); }
const DICTIONARY = eval('({' + dictMatch[1] + '})');

// Build lookup map
const lookupMap = new Map();
for (const [ascii, proper] of Object.entries(DICTIONARY)) {
  const asciiLower = ascii.toLowerCase();
  const properLower = proper.toLowerCase();
  if (asciiLower !== properLower) lookupMap.set(asciiLower, properLower);
}

function preserveCase(original, replacement) {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement.toLowerCase();
}

const sortedKeys = [...lookupMap.keys()].sort((a, b) => b.length - a.length);
const escaped = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const patternStr = escaped.join('|');
const wordRegex = new RegExp('(?<![a-zA-Z\u00e4\u00f6\u00fc\u00c4\u00d6\u00dc\u00df])(' + patternStr + ')(?![a-zA-Z\u00e4\u00f6\u00fc\u00c4\u00d6\u00dc\u00df])', 'gi');

// Find .tsx/.ts files (skip node_modules, ui, .vercel)
function findFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', 'ui', '.vercel'].includes(entry.name)) {
      results.push(...findFiles(full));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.endsWith('.d.ts')) {
      results.push(full);
    }
  }
  return results;
}

const dryRun = process.argv.includes('--dry-run');
const files = findFiles(path.resolve('src'));
let totalChanges = 0;
let filesChanged = 0;

for (const filePath of files) {
  const original = fs.readFileSync(filePath, 'utf-8');
  let count = 0;
  const converted = original.replace(wordRegex, (match) => {
    const lower = match.toLowerCase();
    const replacement = lookupMap.get(lower);
    if (replacement) {
      const result = preserveCase(match, replacement);
      if (result !== match) { count++; return result; }
    }
    return match;
  });
  if (count > 0) {
    filesChanged++;
    totalChanges += count;
    const rel = path.relative(process.cwd(), filePath);
    console.log(`[${count} changes] ${rel}`);
    if (!dryRun) {
      fs.writeFileSync(filePath, converted, 'utf-8');
    }
  }
}

console.log(`\n--- Summary ---`);
console.log(`Files scanned: ${files.length}`);
console.log(`Files changed: ${filesChanged}`);
console.log(`Total replacements: ${totalChanges}`);
if (dryRun) console.log('(dry run — no files modified)');
