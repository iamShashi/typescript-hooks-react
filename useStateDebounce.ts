import { useCallback, useState } from 'react';

let handlerTimeout: any = null;

const useStateDebounce = <T>(initialValue: T, delay: number) => {
  // State and setters for debounced value
  const [value, setDebouncedValue] = useState<T>(initialValue);

  const setState: (v: T) => void = useCallback(
    (v: any) => {
      clearTimeout(handlerTimeout);

      handlerTimeout = setTimeout(() => {
        setDebouncedValue(v);
      }, delay);
    },
    [delay]
  );

  return { value, setState };
};

export default useStateDebounce;
