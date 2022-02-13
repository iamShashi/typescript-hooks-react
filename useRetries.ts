import { useCallback, useState } from 'react';

const useRetries = (maxTimes: number = 5) => {
  const [numOfTimes, setNumOfTimes] = useState(0);

  const retry = (callback: Function) => {
    // console.log('retrying', numOfTimes, maxTimes);
    if (numOfTimes === maxTimes) {
      callback && callback();
    }
    setNumOfTimes((d) => d + 1);
  };

  const reset = useCallback(() => {
    setNumOfTimes(0);
  }, []);

  return { retry, reset };
};

export default useRetries;
