import { useCallback, useMemo, useRef, useState } from 'react';

type PaginationOptions = {
  numberPerPage?: number;
};

const useIntersectionPagination = (items: any[], options: PaginationOptions = {}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef<IntersectionObserver>();

  const { numberPerPage = 40 } = options;

  const paginatedItems = useMemo(() => {
    const trimEnd = numberPerPage * pageNumber;

    return items.slice(0, trimEnd);
  }, [items, numberPerPage, pageNumber]);

  const paginatedItemsLength = useMemo(() => paginatedItems.length, [paginatedItems]);

  const lastRowRef = useCallback(
    (node) => {
      if (paginatedItems.length >= items.length) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((lastPageNumber) => lastPageNumber + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [items, paginatedItems]
  );

  return { paginatedItems, paginatedItemsLength, setPageNumber, lastRowRef };
};

export default useIntersectionPagination;
