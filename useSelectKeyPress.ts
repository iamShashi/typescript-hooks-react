import { useEffect, useState, useCallback } from 'react';
import useKeyPress from './useKeyPress';

type SelectKeyPressOptions = {
  items: any[];
  active: boolean;
  focused: boolean;
  onOpen?: Function;
  onEnter?: Function;
  onTop?: Function;
  onBottom?: Function;
  ref?: React.RefObject<HTMLDivElement>;
};

const useSelectKeyPress = ({
  ref,
  items,
  active,
  focused,
  onOpen,
  onTop,
  onEnter,
  onBottom,
}: SelectKeyPressOptions) => {
  const downPress = useKeyPress('ArrowDown');
  const upPress = useKeyPress('ArrowUp');
  const enterPress = useKeyPress('Enter');

  const [cursor, setCursor] = useState(-1);

  const resetCursor = useCallback(() => {
    setTimeout(() => {
      setCursor(-1);
    }, 100);
  }, []);

  useEffect(() => {
    if (items.length && downPress && active) {
      setCursor((prevState) => (prevState < items.length - 1 ? prevState + 1 : prevState));
    }
  }, [downPress, items, active]);

  useEffect(() => {
    if (items.length && upPress && active) {
      setCursor((prevState) => (prevState >= 0 ? prevState - 1 : prevState));
    }
  }, [upPress, items, active]);

  useEffect(() => {
    if (enterPress && active) {
      onEnter && onEnter(items[cursor], cursor);
    }
  }, [enterPress, active, cursor, items, onEnter]);

  useEffect(() => {
    if (downPress && !active && focused) {
      onOpen && onOpen(true);
    }
  }, [downPress, focused, active, onOpen]);

  useEffect(() => {
    if (cursor > -1 && active && ref && ref.current) {
      const children = ref.current.children as any;

      children[cursor] && children[cursor].focus && children[cursor].focus();
    }
  }, [cursor, ref, active]);

  useEffect(() => {
    if (upPress && cursor === -1 && active) {
      onTop && onTop();
    }
    if (downPress && cursor === items.length && active) {
      onBottom && onBottom();
    }
  }, [upPress, downPress, cursor, items, active, onTop, onBottom]);

  return { cursor, resetCursor };
};

export default useSelectKeyPress;
