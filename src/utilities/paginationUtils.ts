export const getValidPageFromParams = (
  searchParams: URLSearchParams,
  defaultPage = 1
): number => {
  const raw = Number(searchParams.get('page'));
  return !isNaN(raw) && raw > 0 ? raw : defaultPage;
};

export const getOffsetFromPage = (page: number, pageSize: number): number =>
  (page - 1) * pageSize;

export const getTotalPages = (count: number, pageSize: number): number =>
  Math.max(1, Math.ceil(count / pageSize));
