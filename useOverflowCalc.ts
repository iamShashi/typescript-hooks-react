import { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import useEventListener from './useEventListener';

const useOverflowCalc = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  extraButtonID: string,
  deps?: any
) => {
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const childrenMeta = useRef<{ width: number; index: number; offset: number }[]>([]);

  const calcOverflow = useCallback(() => {
    if (ref.current) {
      const { clientWidth, children } = ref.current;

      const childrenLength = childrenMeta.current.length;
      const hidden: string[] = [];
      let left = 0;
      for (let i = 0; i < childrenLength; i++) {
        const { index, width, offset } = childrenMeta.current[i];
        const domChild = children[index] as HTMLButtonElement;
        if (domChild) {
          if (domChild.id !== extraButtonID) {
            if (clientWidth <= offset) {
              domChild.style.visibility = 'hidden';
              hidden.push(domChild.id);
            } else {
              left += width + 16;
              domChild.style.visibility = 'visible';
            }
          } else {
            domChild.style.left = `${left + 16}px`;
          }
        }
      }

      setHiddenItems(() => hidden);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, extraButtonID, deps]);

  useEventListener('resize', calcOverflow);

  useLayoutEffect(() => {
    if (ref.current) {
      const data = [];
      let offset = 32 + 40;
      const childrenLength = ref.current.children.length;
      for (let i = 0; i < childrenLength; i++) {
        const child = ref.current.children[i];
        if (child) {
          const width = child.getBoundingClientRect().width;
          offset += width + 16;
          data.push({
            index: i,
            offset,
            width,
          });
        }
      }
      childrenMeta.current = data;

      setHiddenItems(() => []);
      calcOverflow();
    }
  }, [ref, calcOverflow, deps]);

  return [hiddenItems];
};

export default useOverflowCalc;
