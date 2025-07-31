import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDetailedPokemonData } from '../api/pokemonDetailed';
import type { DetailedResult } from '../types/pokemon';

export const usePokemonDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsName = searchParams.get('details');
  const [detailsData, setDetailsData] = useState<DetailedResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!detailsName) {
        setDetailsData(null);
        return;
      }

      try {
        const data = await fetchDetailedPokemonData(detailsName);
        if (!cancelled) setDetailsData(data);
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading details:', error);
          setDetailsData(null);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [detailsName]);

  const clearDetails = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    setSearchParams(newParams, { replace: true });
  };

  return { detailsData, clearDetails };
};
