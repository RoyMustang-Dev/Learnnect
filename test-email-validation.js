// Simple test for email validation
const { validateEmail, getEmailValidationError } = require('./src/utils/validation.ts');

// Test cases
const testEmails = [
  'hgbb@gmail',           // Invalid - no TLD
  'test@example.com',     // Valid
  'user@domain',          // Invalid - no TLD
  'test@.com',            // Invalid - no domain
  'test@domain.',         // Invalid - TLD too short
  'test@domain.c',        // Invalid - TLD too short
  'test@domain.co',       // Valid
  'test@domain.info',     // Valid
  'test@domain.museum',   // Valid
  'test@domain.toolong',  // Invalid - TLD too long
  '',                     // Invalid - empty
  'test',                 // Invalid - no @
  '@domain.com',          // Invalid - no local part
  'test@',                // Invalid - no domain
  'test..test@domain.com', // Invalid - consecutive dots
  '.test@domain.com',     // Invalid - starts with dot
  'test.@domain.com',     // Invalid - ends with dot
];

console.log('Email Validation Test Results:');
console.log('================================');

testEmails.forEach(email => {
  const isValid = validateEmail(email);
  const error = getEmailValidationError(email);
  
  console.log(`Email: "${email}"`);
  console.log(`Valid: ${isValid}`);
  console.log(`Error: ${error || 'None'}`);
  console.log('---');
});
