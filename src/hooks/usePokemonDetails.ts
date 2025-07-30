import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDetailedPokemonData } from '../api/pokemonDetailed';
import type { DetailedResult } from '../types/pokemon';

export const usePokemonDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsName = searchParams.get('details');
  const [detailsData, setDetailsData] = useState<DetailedResult | null>(null);

  useEffect(() => {
    if (detailsName) {
      fetchDetailedPokemonData(detailsName).then(setDetailsData);
    } else {
      setDetailsData(null);
    }
  }, [detailsName]);

  const clearDetails = () => {
    searchParams.delete('details');
    setSearchParams(searchParams);
  };

  return { detailsData, clearDetails };
};
