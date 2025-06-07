#!/usr/bin/env node

/**
 * Production Console Log Cleanup Script
 * Wraps all console.log, console.warn, console.error statements with development mode checks
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function wrapConsoleLog(content) {
  // Pattern to match console.log, console.warn, console.error statements
  const consolePattern = /^(\s*)(console\.(log|warn|error)\([^;]*\);?)$/gm;
  
  return content.replace(consolePattern, (match, indent, consoleStatement) => {
    // Skip if already wrapped
    if (match.includes('import.meta.env.MODE')) {
      return match;
    }
    
    return `${indent}if (import.meta.env.MODE === 'development') {\n${indent}  ${consoleStatement}\n${indent}}`;
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = wrapConsoleLog(content);
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Cleaned: ${path.relative(srcDir, filePath)}`);
  }
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

console.log('🧹 Starting console log cleanup...');
processDirectory(srcDir);
console.log('✅ Console log cleanup completed!');
