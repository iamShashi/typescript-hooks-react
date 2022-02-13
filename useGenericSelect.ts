import { useMemo, useState } from 'react';
import { findSelected } from '../util';

type GenericSelectOptions = {
  items: any[];
  itemKey: string;
  defaultSelection?: any;
};

const useGenericSelect = ({ items, itemKey, defaultSelection = {} }: GenericSelectOptions) => {
  const [selection, setSelection] = useState(defaultSelection);

  const isAnySelected = useMemo(() => {
    return !!Object.keys(selection).filter((k) => selection[k]).length;
  }, [selection]);

  const selected = useMemo(() => {
    return findSelected(items, selection, itemKey);
  }, [selection, items, itemKey]);

  const isAllSelected = useMemo(() => {
    let value = true;

    if (!items.length) {
      value = false;
    }

    for (let i = 0; i < items.length; i++) {
      const key = items[i][itemKey];
      if (!selection[key]) {
        value = false;
        break;
      }
    }

    return value;
  }, [selection, itemKey, items]);

  const isSelected = (p: any) => {
    const id = p[itemKey];
    return selection[id] || false;
  };

  const select = (p: any) => {
    const id = p[itemKey];
    setSelection((s: any) => ({ ...s, [id]: !s[id] }));
  };

  const selectAll = (value?: boolean) => {
    const toggleValue = value !== undefined ? value : !isAllSelected;
    const obj = items.reduce((p: any, c: any) => {
      return { ...p, [c[itemKey]]: toggleValue };
    }, {});

    setSelection(() => obj);
  };

  return { selected, isAnySelected, isAllSelected, selectAll, select, isSelected };
};

export default useGenericSelect;
