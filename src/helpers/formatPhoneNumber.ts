// src/helpers/formatPhoneNumber.ts

/**
 * Formats a Philippine phone number to international format (+63)
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number in +63XXXXXXXXXX format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  if (!digitsOnly) return '';
  
  // If already starts with +63, return as is
  if (phoneNumber.startsWith('+63')) {
    return phoneNumber;
  }
  
  // If starts with 63, add + prefix
  if (digitsOnly.startsWith('63')) {
    return '+' + digitsOnly;
  }
  
  // If starts with 0, replace 0 with +63
  if (digitsOnly.startsWith('0')) {
    return '+63' + digitsOnly.substring(1);
  }
  
  // If starts with 9 (and length is 10), add +63
  if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
    return '+63' + digitsOnly;
  }
  
  // For any other input that's not empty, assume it's a Philippine number
  if (digitsOnly) {
    // If it looks like it might be a complete number (10-12 digits), format it
    if (digitsOnly.length >= 10 && digitsOnly.length <= 12) {
      // Try to format as +63XXXXXXXXXX
      if (digitsOnly.startsWith('63') && digitsOnly.length === 12) {
        return '+' + digitsOnly;
      }
      if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
        return '+63' + digitsOnly.substring(1);
      }
      if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
        return '+63' + digitsOnly;
      }
    }
    // For partial numbers, just show as user typed
    return phoneNumber;
  }
  
  return phoneNumber;
};

/**
 * Validates if a phone number is a valid Philippine mobile number
 * @param phoneNumber - The phone number to validate
 * @returns boolean indicating if the number is valid
 */
export const isValidPhilippineNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Philippine mobile numbers: 09XXXXXXXXX (11 digits starting with 09)
  const phMobileRegex = /^09\d{9}$/;
  
  return phMobileRegex.test(digitsOnly);
};

/**
 * Converts phone number to backend format (09XXXXXXXXX)
 * @param phoneNumber - Phone number in any format
 * @returns Phone number in 09XXXXXXXXX format for backend
 */
export const convertToBackendFormat = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  if (!digitsOnly) return '';
  
  // If starts with 63 (from +63), convert to 09
  if (digitsOnly.startsWith('63')) {
    const remaining = digitsOnly.substring(2); // Remove 63
    return '0' + remaining;
  }
  
  // If starts with 0, return as is
  if (digitsOnly.startsWith('0')) {
    return digitsOnly;
  }
  
  // If starts with 9, add 0
  if (digitsOnly.startsWith('9')) {
    return '0' + digitsOnly;
  }
  
  // For any other format, return digits as is
  return digitsOnly;
};

// Optionally export all functions as an object
export default {
  formatPhoneNumber,
  isValidPhilippineNumber,
  convertToBackendFormat
};