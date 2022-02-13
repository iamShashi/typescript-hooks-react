import { useCallback, useState } from 'react';
import useEventListener from './useEventListener';

type PostionOptions = {
  offsetY?: number;
  offsetX?: number;
  right?: boolean;
};

const usePosition = (parent: React.RefObject<any>, options: PostionOptions = {}) => {
  const [dimensions, setDimenstions] = useState<React.CSSProperties>({});

  const positionElement = useCallback(() => {
    if (parent.current) {
      const { offsetY = 4, offsetX = 0, right: rightFlag = false } = options;
      const { width, top, left, right, height } = parent.current.getBoundingClientRect();

      const pos: any = {};

      if (rightFlag) {
        const screenWidth =
          window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        pos.right = `${screenWidth - right + offsetX}px`;
      } else {
        pos.left = `${left + offsetX}px`;
      }

      setDimenstions(() => ({
        ...pos,
        width: `${width}px`,
        transform: `translate3d(0px, ${top + height + offsetY}px, 0px)`,
      }));
    }
  }, [parent, options]);

  useEventListener('resize', positionElement);
  useEventListener('scroll', positionElement, undefined, true);

  return { dimensions, positionElement };
};

export default usePosition;
