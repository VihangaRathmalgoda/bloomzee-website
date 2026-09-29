/** Replace {key} placeholders in a template string. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** Build a wa.me link. `number` may contain spaces, "+" or dashes — they are stripped. */
export function whatsappUrl(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

export function telUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function mailUrl(email: string): string {
  return `mailto:${email}`;
}

/** Wrap an index into [0, length). */
export function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}
