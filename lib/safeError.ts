export function publicErrorMessage(_error: unknown, fallback: string): string {
  return fallback;
}

export function isSafeSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]{1,180}$/.test(slug);
}
