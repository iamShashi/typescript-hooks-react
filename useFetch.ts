import { useEffect, useState } from 'react';
import { IS_DEVELOPMENT } from '../config';
import { apiCall, fresh as freshBody } from '../util';

type FetchOptions = {
  data?: any;
  args?: any;
  body?: any;
  type?: string;
  fresh?: boolean;
  loading?: boolean;
  timeout?: number;
  onError?: Function;
  onSuccess?: Function;
  onTimeout?: Function;
};

const useFetch = (
  call: Function | string,
  deps: any[] = [],
  {
    onError,
    onSuccess,
    data = {},
    args = [],
    body = {},
    type = 'GET',
    fresh = false,
    loading = false,
  }: FetchOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(loading);
  const [fetchData, setFetchData] = useState(data);
  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (call) {
          setIsLoading(true);
          let data = null;
          if (typeof call === 'function') {
            data = await call(...args);
          } else if (typeof call === 'string') {
            data = await apiCall(
              type,
              call,
              type === 'GET' ? undefined : fresh ? freshBody(body) : body
            );
          }

          if (data === null) {
            return;
          }

          setFetchData(data);
          onSuccess && onSuccess(data);
        }
      } catch (error) {
        if (IS_DEVELOPMENT) {
          console.error('error', error);
        }
        setError(error);
        setIsLoading(false);
        onError && onError();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return { loading: isLoading, response: fetchData, error };
};

export default useFetch;
