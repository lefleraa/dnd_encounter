import { useEffect, useLayoutEffect } from 'react';

const useWindow = (
  { onMount, onFocus, onBlur, onOnline, onOffline, onLoad, onUnload },
  deps
) => {
  useEffect(() => {
    if (typeof onMount === 'function') {
      onMount();
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof onFocus === 'function') {
      window.addEventListener('focus', onFocus);
    }
    if (typeof onOnline === 'function') {
      window.addEventListener('online', onOnline);
    }
    if (typeof onLoad === 'function') {
      window.addEventListener('load', onLoad);
    }
    if (typeof onBlur === 'function') {
      window.addEventListener('blur', onBlur);
    }
    if (typeof onOffline === 'function') {
      window.addEventListener('offline', onOffline);
    }
    if (typeof onUnload === 'function') {
      window.addEventListener('unload', onUnload);
    }

    return () => {
      if (typeof onFocus === 'function') {
        window.removeEventListener('focus', onFocus);
      }
      if (typeof onOnline === 'function') {
        window.removeEventListener('online', onOnline);
      }
      if (typeof onLoad === 'function') {
        window.removeEventListener('load', onLoad);
      }
      if (typeof onBlur === 'function') {
        window.removeEventListener('blur', onBlur);
      }
      if (typeof onOffline === 'function') {
        window.removeEventListener('offline', onOffline);
      }
      if (typeof onUnload === 'function') {
        window.removeEventListener('unload', onUnload);
      }
    };
  }, deps || []);
};

export default useWindow;
