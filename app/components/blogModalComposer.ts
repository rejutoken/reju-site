export type BlogComposerTarget = {
  formId: string;
  label: string;
  busy: boolean;
} | null;

export function commentFormId(slug: string) {
  return `blog-comment-form-${slug}`;
}

export function replyFormId(slug: string, commentId: string) {
  return `blog-reply-form-${slug}-${commentId}`;
}