// lib/validators.ts - Form validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
  return '';
}

/**
 * Validate Botswana phone number
 */
export function validatePhone(phone: string): string {
  if (!phone) return 'Phone number is required';
  
  const cleaned = phone.replace(/\s/g, '');
  const botswanaRegex = /^(7[1-8]|72|74|75|76|77|78|79)\d{6}$/;
  
  if (!botswanaRegex.test(cleaned)) {
    return 'Valid Botswana number required (e.g., 71 123 456)';
  }
  
  return '';
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Must be at least 8 characters';
  if (!/(?=.*[a-z])/.test(password)) return 'Include lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Include uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Include number';
  return '';
}

/**
 * Validate property price
 */
export function validatePrice(price: number): string {
  if (!price || price <= 0) return 'Price must be greater than 0';
  if (price > 1000000) return 'Price seems too high';
  return '';
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): string {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
}

/**
 * Validate form data object
 */
export function validateForm(data: Record<string, any>, rules: Record<string, (value: any) => string>): ValidationResult {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const error = rules[field](data[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}