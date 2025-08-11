import { useSearchParams } from 'react-router-dom';

export const useValidateParams = (allowed: string[]) => {
  const [params] = useSearchParams();
  return !Array.from(params.keys()).some((key) => !allowed.includes(key));
};
