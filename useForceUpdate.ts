import { useCallback, useState } from 'react';

const useForceUpdate = () => {
  const [, setTick] = useState(0);

  const forceUpdate = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);

  return forceUpdate;
};

export default useForceUpdate;
