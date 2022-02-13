import { useEffect, useState } from 'react';

type HoverOptions = {
  active?: boolean;
  ref: React.RefObject<HTMLDivElement>;
};

const useHover = ({ ref, active }: HoverOptions) => {
  const [value, setValue] = useState(false);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [ref, active]);
  return [value];
};

export default useHover;
