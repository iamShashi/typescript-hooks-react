import { useCallback, useMemo } from 'react';

type SelectOptions = {
  value: any;
  items: any[];
  itemKey: string;
  itemText: string;
  combobox?: boolean;
  multiSelect?: boolean;
};

const useSelect = ({
  itemKey,
  value,
  items = [],
  combobox,
  itemText,
  multiSelect,
}: SelectOptions) => {
  const isItemAnObjArray = useMemo(
    () => items.length && items[0] && items[0].constructor === Object,
    [items]
  );

  const isValueAnArray = useMemo(() => value && Array.isArray(value), [value]);

  const getKey = useCallback(
    (i: any) => {
      if (isItemAnObjArray) {
        return i[itemKey];
      } else {
        return i;
      }
    },
    [isItemAnObjArray, itemKey]
  );

  const selectedItemsMap = useMemo(() => {
    const obj: any = {};

    const set = (k: string, v: boolean) => (k ? (obj[k] = v) : null);

    if (isValueAnArray) {
      const valueLength = value.length;
      for (let i = 0; i < valueLength; i++) {
        const key = value[i];
        set(key, true);
        if (!multiSelect && i === 1) {
          break;
        }
      }
    } else {
      set(value, true);
    }

    return obj;
  }, [isValueAnArray, value, multiSelect]);

  // const getStringItem = useCallback((index: number) => items[index], [items]);

  const getObjectItem = useCallback(
    (key: string) => items.find((i) => i[itemKey] === key),
    [itemKey, items]
  );

  const isSelected = (item: any) => selectedItemsMap[getKey(item)];

  const getActiveText = useCallback(() => {
    const getText = (key: any) => {
      const foundItem = getObjectItem(key);
      const defaultText = combobox ? value : '';

      return foundItem ? foundItem[itemText] : defaultText;
    };

    const properText = () => {
      if (multiSelect) {
        if (isValueAnArray) {
          let textArray: string[] = [];
          const valueLength = value.length;
          for (let i = 0; i < valueLength; i++) {
            const foundText = getText(value[i]);
            if (foundText) {
              textArray.push(foundText);
            }
          }

          return valueLength
            ? `${valueLength > 1 ? `(${valueLength} selected)` : ''} ${textArray.join(', ')}`
            : '';
        } else {
          return getText(value);
        }
      } else {
        return getText(value);
      }
    };

    return isItemAnObjArray ? properText() : value || '';
  }, [isItemAnObjArray, multiSelect, isValueAnArray, value, getObjectItem, combobox, itemText]);

  const getValue = useCallback(
    (item: any, index?: number) => {
      const properValue = (newV: string) => {
        if (multiSelect) {
          const currSelected = !!selectedItemsMap[newV];
          const newValueArray = isValueAnArray ? [...value, newV] : [newV];
          return currSelected ? newValueArray.filter((v) => v && v !== newV) : newValueArray;
        } else {
          return newV;
        }
      };

      return isItemAnObjArray
        ? properValue(item ? item[itemKey] || '' : '')
        : properValue(item || '');
    },
    [isItemAnObjArray, isValueAnArray, itemKey, multiSelect, selectedItemsMap, value]
  );

  const isAllItemsSelected = useMemo(
    () => new Set(items.map((i: any) => i[itemKey])).size === Object.keys(selectedItemsMap).length,
    [items, itemKey, selectedItemsMap]
  );

  return { getValue, isSelected, isAllItemsSelected, getActiveText };
};

export default useSelect;
