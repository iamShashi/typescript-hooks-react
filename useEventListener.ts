import { RefObject, useEffect, useRef } from 'react';

const useEventListener = <T extends HTMLElement = HTMLDivElement>(
  eventName: keyof WindowEventMap,
  handler: (event: Event) => void,
  element?: RefObject<T>,
  options?: any
) => {
  const savedHandler = useRef<(event: Event) => void>();

  useEffect(() => {
    const targetElement: T | Window = element?.current || window;

    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    const eventListener = (event: Event) => {
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options, handler]);
};

export default useEventListener;
