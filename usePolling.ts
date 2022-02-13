import { useEffect, useRef } from 'react';

import { poll } from '../util';

type PollOptions = {
  args?: any;
  deps?: any;
  timeout?: number;
  interval?: number;
  maxAttempts?: number;
};

const usePolling = (call: Function, callback: Function, options: PollOptions = {}) => {
  let cleanupFunction = useRef(() => console.log('pre cleanup in usePolling'));

  useEffect(() => {
    (async () => {
      try {
        const { cleanup } = await poll(call, callback, options);
        cleanupFunction.current = cleanup;
      } catch (error) {
        console.error('error while executing callback: ' + error);
      }
    })();

    return () => cleanupFunction.current && cleanupFunction.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.deps]);
};

export default usePolling;
