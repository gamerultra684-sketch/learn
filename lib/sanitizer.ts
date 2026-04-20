/**
 * Simple Input Sanitizer to prevent XSS and normalize strings.
 */
export function sanitize(str: string): string {
  if (!str) return '';
  
  return str
    .trim()
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '') // Remove scripts
    .replace(/on\w+="[^"]*"/gim, '') // Remove onmouseover, onclick, etc.
    .replace(/javascript:[^"]*/gim, ''); // Remove javascript: pseudo-protocol
}

export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj;

  const result: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitize(value);
    } else if (typeof value === 'object') {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
