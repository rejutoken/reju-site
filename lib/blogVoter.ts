const VOTER_STORAGE_KEY = "rejuBlogVoterId";

export function getOrCreateVoterId(): string {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem(VOTER_STORAGE_KEY)?.trim();
  if (existing && /^[a-zA-Z0-9-]{8,64}$/.test(existing)) {
    return existing;
  }

  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `voter-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(VOTER_STORAGE_KEY, created);
  return created;
}