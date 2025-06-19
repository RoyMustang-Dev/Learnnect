// Enhanced validation utilities for Learnnect

/**
 * Enhanced email validation with comprehensive checks
 * @param email - Email address to validate
 * @returns boolean - true if email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Remove whitespace
  email = email.trim();
  
  // Basic length check
  if (email.length < 5 || email.length > 254) return false;
  
  // Enhanced regex pattern that requires:
  // - Valid characters before @
  // - @ symbol
  // - Valid domain name
  // - At least one dot
  // - Valid TLD (2-6 characters)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/;
  
  if (!emailRegex.test(email)) return false;
  
  // Additional checks
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const [localPart, domainPart] = parts;
  
  // Local part checks
  if (localPart.length === 0 || localPart.length > 64) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  
  // Domain part checks
  if (domainPart.length === 0 || domainPart.length > 253) return false;
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
  if (domainPart.startsWith('-') || domainPart.endsWith('-')) return false;
  if (domainPart.includes('..')) return false;
  
  // Must have at least one dot in domain
  if (!domainPart.includes('.')) return false;
  
  // Check TLD
  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || tld.length > 6) return false;
  
  return true;
};

/**
 * Get email validation error message
 * @param email - Email address to validate
 * @returns string - Error message or empty string if valid
 */
export const getEmailValidationError = (email: string): string => {
  if (!email || email.trim() === '') return 'Email address is required';
  
  email = email.trim();
  
  if (email.length < 5) return 'Email address is too short';
  if (email.length > 254) return 'Email address is too long';
  
  if (!email.includes('@')) return 'Email must contain @ symbol';
  
  const parts = email.split('@');
  if (parts.length !== 2) return 'Email must contain exactly one @ symbol';
  
  const [localPart, domainPart] = parts;
  
  if (localPart.length === 0) return 'Email must have content before @';
  if (localPart.length > 64) return 'Email local part is too long';
  
  if (domainPart.length === 0) return 'Email must have a domain after @';
  if (!domainPart.includes('.')) return 'Email domain must contain at least one dot';
  
  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];
  
  if (tld.length < 2) return 'Email domain extension is too short (minimum 2 characters)';
  if (tld.length > 6) return 'Email domain extension is too long (maximum 6 characters)';
  
  if (!validateEmail(email)) return 'Please enter a valid email address';
  
  return '';
};

/**
 * Enhanced phone validation with Indian number support
 * @param phone - Phone number to validate
 * @returns boolean - true if phone is valid
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  // Check if it's an Indian number
  if (cleanPhone.startsWith('+91') || cleanPhone.startsWith('91')) {
    // Extract the 10-digit mobile number
    const mobileNumber = cleanPhone.replace(/^(\+91|91)/, '');

    // Indian mobile numbers must be exactly 10 digits and start with 9, 8, 7, or 6
    if (mobileNumber.length === 10) {
      const firstDigit = mobileNumber.charAt(0);
      return ['9', '8', '7', '6'].includes(firstDigit);
    }
    return false;
  }

  // For other countries, use general validation
  // Must start with + or digit, and be 7-15 digits total
  return /^[+]?[1-9][\d]{6,14}$/.test(cleanPhone);
};

/**
 * Get phone validation error message
 * @param phone - Phone number to validate
 * @returns string - Error message or empty string if valid
 */
export const getPhoneValidationError = (phone: string): string => {
  if (!phone || phone.trim() === '') return 'Phone number is required';

  const cleanPhone = phone.replace(/[^\d+]/g, '');

  if (cleanPhone.length < 7) return 'Phone number is too short';
  if (cleanPhone.length > 15) return 'Phone number is too long';

  // Check if it's an Indian number
  if (cleanPhone.startsWith('+91') || cleanPhone.startsWith('91')) {
    const mobileNumber = cleanPhone.replace(/^(\+91|91)/, '');

    if (mobileNumber.length !== 10) {
      return 'Indian mobile numbers must be exactly 10 digits';
    }

    const firstDigit = mobileNumber.charAt(0);
    if (!['9', '8', '7', '6'].includes(firstDigit)) {
      return 'Indian mobile numbers must start with 9, 8, 7, or 6';
    }
  }

  if (!validatePhone(phone)) return 'Please enter a valid phone number';

  return '';
};

/**
 * Enhanced password validation
 * @param password - Password to validate
 * @returns boolean - true if password is valid
 */
export const validatePassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') return false;
  
  return password.length >= 8 &&
         /(?=.*[a-z])/.test(password) &&
         /(?=.*[A-Z])/.test(password) &&
         /(?=.*\d)/.test(password);
};

/**
 * Get password validation error message
 * @param password - Password to validate
 * @returns string - Error message or empty string if valid
 */
export const getPasswordValidationError = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  return '';
};
