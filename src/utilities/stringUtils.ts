export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase();
}

export function normalizeFlavorText(text: string): string {
  return text.replace(/[\n\f]/g, ' ');
}
