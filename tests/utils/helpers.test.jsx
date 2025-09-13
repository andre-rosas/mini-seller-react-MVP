import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  formatCurrency, 
  getStatusColor, 
  getStageColor 
} from '../../src/utils/helpers.js';

describe('validateEmail', () => {
  // Positive Tests
  it('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('email+tag@example.org')).toBe(true);
    expect(validateEmail('123@domain.com')).toBe(true);
    expect(validateEmail('user_name@domain.com')).toBe(true);
  });

  // Negative Tests
  it('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
    expect(validateEmail('user name@domain.com')).toBe(false);
    expect(validateEmail('user@domain.')).toBe(false);
    expect(validateEmail('.user@domain.com')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(123)).toBe(false);
    expect(validateEmail({})).toBe(false);
  });
});

describe('formatCurrency', () => {
  // Positive Tests
  it('should format numbers as Brazilian currency', () => {
    expect(formatCurrency(1000)).toMatch(/R\$\s1.000,00/);
    expect(formatCurrency(1500.50)).toMatch(/R\$\s1.500,50/);
    expect(formatCurrency(0)).toMatch(/R\$\s0,00/);
    expect(formatCurrency(999.99)).toMatch(/R\$\s999,99/);
    expect(formatCurrency(1000000)).toMatch(/R\$\s1.000.000,00/);
  });

  // Negative Tests
  it('should handle invalid inputs', () => {
    expect(() => formatCurrency('')).not.toThrow();
    expect(() => formatCurrency(null)).not.toThrow();
    expect(() => formatCurrency(undefined)).not.toThrow();
    expect(() => formatCurrency('invalid')).not.toThrow();
    expect(formatCurrency(NaN)).toMatch(/R\$\sNaN/);
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-100)).toMatch(/-R\$\s100,00/);
    expect(formatCurrency(-1500.75)).toMatch(/-R\$\s1.500,75/);
  });
});

describe('getStatusColor', () => {
  // Positive Tests
  it('should return correct colors for valid statuses', () => {
    expect(getStatusColor('new')).toBe('bg-blue-100 text-blue-800');
    expect(getStatusColor('contacted')).toBe('bg-yellow-100 text-yellow-800');
    expect(getStatusColor('qualified')).toBe('bg-green-100 text-green-800');
    expect(getStatusColor('closed-won')).toBe('bg-green-100 text-green-800');
    expect(getStatusColor('closed-lost')).toBe('bg-red-100 text-red-800');
  });

  // Negative Tests
  it('should return default color for invalid statuses', () => {
    expect(getStatusColor('invalid')).toBe('bg-gray-100 text-gray-800');
    expect(getStatusColor('')).toBe('bg-gray-100 text-gray-800');
    expect(getStatusColor(null)).toBe('bg-gray-100 text-gray-800');
    expect(getStatusColor(undefined)).toBe('bg-gray-100 text-gray-800');
    expect(getStatusColor(123)).toBe('bg-gray-100 text-gray-800');
  });
});

describe('getStageColor', () => {
  // Positive Tests
  it('should return correct colors for valid stages', () => {
    expect(getStageColor('prospecting')).toBe('bg-blue-100 text-blue-800');
    expect(getStageColor('qualification')).toBe('bg-yellow-100 text-yellow-800');
    expect(getStageColor('proposal')).toBe('bg-orange-100 text-orange-800');
    expect(getStageColor('negotiation')).toBe('bg-purple-100 text-purple-800');
    expect(getStageColor('closed-won')).toBe('bg-green-100 text-green-800');
    expect(getStageColor('closed-lost')).toBe('bg-red-100 text-red-800');
  });

  // Negative Tests
  it('should return default color for invalid stages', () => {
    expect(getStageColor('invalid')).toBe('bg-gray-100 text-gray-800');
    expect(getStageColor('')).toBe('bg-gray-100 text-gray-800');
    expect(getStageColor(null)).toBe('bg-gray-100 text-gray-800');
    expect(getStageColor(undefined)).toBe('bg-gray-100 text-gray-800');
  });
});