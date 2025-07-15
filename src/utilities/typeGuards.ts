export function isError(error: unknown): error is Error {
  return error instanceof Error && typeof error.message === 'string';
}
