export function validateUsername(username: unknown): username is string {
  return typeof username === 'string' && username.length >= 3 && username.length <= 50;
}

export function validateEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6;
}

export function getValidationError(field: string, value: unknown): string | null {
  switch (field) {
    case 'username':
      if (!validateUsername(value)) {
        return 'Username must be between 3 and 50 characters';
      }
      break;
    case 'email':
      if (!validateEmail(value)) {
        return 'Invalid email address';
      }
      break;
    case 'password':
      if (!validatePassword(value)) {
        return 'Password must be at least 6 characters long';
      }
      break;
  }
  return null;
}
