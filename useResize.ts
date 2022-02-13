import { RefObject, useCallback, useEffect, useState } from 'react';
import useEventListener from './useEventListener';

type SizeState = {
  width?: number;
  height?: number;
};

const useResize = <T extends HTMLElement = HTMLDivElement>(elementRef?: RefObject<T>) => {
  const [size, setSize] = useState<SizeState>({
    width: undefined,
    height: undefined,
  });

  const updateSize = useCallback(() => {
    const node = elementRef?.current;
    if (node) {
      setSize({
        width: node.offsetWidth || 0,
        height: node.offsetHeight || 0,
      });
    } else {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [elementRef]);

  useEffect(() => {
    updateSize();
  }, [updateSize]);

  useEventListener('resize', updateSize);

  return size;
};

export default useResize;
