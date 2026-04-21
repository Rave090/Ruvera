const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;
const PASSWORD_MIN_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value > 0;
}

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

export function validateEmail(email: string): ValidationResult {
  if (!isNonEmptyString(email)) return { isValid: false, message: 'Email is required.' };
  if (!isValidEmail(email)) return { isValid: false, message: 'Enter a valid email address.' };
  return { isValid: true, message: null };
}

export function validatePassword(password: string): ValidationResult {
  if (!isNonEmptyString(password)) return { isValid: false, message: 'Password is required.' };
  if (password.length < PASSWORD_MIN_LENGTH)
    return { isValid: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  if (!isValidPassword(password))
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, and a number.',
    };
  return { isValid: true, message: null };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!isNonEmptyString(value))
    return { isValid: false, message: `${fieldName} is required.` };
  return { isValid: true, message: null };
}
