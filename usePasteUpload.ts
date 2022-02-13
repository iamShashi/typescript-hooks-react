import { useEffect, useRef, useCallback } from 'react';
// import usePasteHandler from "./usePasteHandler";

// import type { UploadOptions } from "@rpldy/shared";
// import type { PasteUploadHandler, PasteUploadHookResult, PasteElementRef } from './types';

type PasteUploadHookResult = {
  uploadOptions: any;
  element: React.RefObject<HTMLDivElement>;
  onPasteUpload: Function;
};

const registerHandler = (
  element: React.RefObject<HTMLDivElement>,
  handler: (event: any) => void
) => {
  const target = element?.current || window;
  target.addEventListener('paste', handler);
};

const unregisterHandler = (
  element: React.RefObject<HTMLDivElement>,
  handler: (event: any) => void
) => {
  const target = element?.current || window;
  target.removeEventListener('paste', handler);
};

const usePasteUpload = ({ uploadOptions, element, onPasteUpload }: PasteUploadHookResult) => {
  const enabledRef = useRef(true);

  const onPaste = onPasteUpload;

  const listener = useCallback(
    (event: any) => {
      onPaste(event);
    },
    [onPaste]
  );

  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;

    if (enabledRef.current) {
      registerHandler(element, listener);
    } else {
      unregisterHandler(element, listener);
    }

    return enabledRef.current;
  }, [element, listener]);

  const getIsEnabled = useCallback(() => enabledRef.current, []);

  useEffect(() => {
    if (enabledRef.current) {
      registerHandler(element, listener);
    }

    return () => {
      if (enabledRef.current) {
        unregisterHandler(element, listener);
      }
    };
  }, [element, listener, onPaste]);

  return { toggle, getIsEnabled };
};

export default usePasteUpload;
