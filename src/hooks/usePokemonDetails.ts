import { useSearchParams } from 'react-router-dom';
import { useGetPokemonDetailsQuery } from '../api/pokemonApi';

export const usePokemonDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsName = searchParams.get('details');

  const {
    data: detailsData,
    isLoading,
    isError,
    refetch,
  } = useGetPokemonDetailsQuery(detailsName ?? '', {
    skip: !detailsName,
  });

  const clearDetails = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    setSearchParams(newParams, { replace: true });
  };

  return {
    detailsData,
    isLoading,
    isError,
    refetch,
    clearDetails,
  };
};
