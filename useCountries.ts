import { useEffect, useMemo, useState } from 'react';

import { fetchCountries, fetchStates } from '../services/api';
import useFetch from './useFetch';

type CountriesOptions = {
  dep?: any;
};

const useCountries = ({ dep }: CountriesOptions = {}) => {
  const [states, setStates] = useState([]);

  const { response, loading } = useFetch(fetchCountries);

  const countries = useMemo(
    () => (loading ? [] : (response && response.data) || []),
    [loading, response]
  );

  useEffect(() => {
    (async () => {
      try {
        const country = countries.find((c: any) => c.name === dep);

        if (country) {
          const response = await fetchStates(country.code);

          setStates(response.data);
        }
      } catch (error) {
        console.error(error);
        setStates([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);

  return { countries, states };
};

export default useCountries;
