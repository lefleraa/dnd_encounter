import { useEffect, useLayoutEffect } from 'react';
import { triggerToast } from 'components/Toast';

import { faWifi, faWifiSlash } from '@fortawesome/pro-regular-svg-icons';

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
      window.addEventListener('focus', () => {
        onFocus();
      });
    }
    if (typeof onOnline === 'function') {
      window.addEventListener('online', () => {
        onOnline();
        triggerToast({
          variant: 'success',
          icon: faWifi,
          text: 'Connected.',
        });
      });
    }
    if (typeof onLoad === 'function') {
      window.addEventListener('load', () => {
        onLoad();
        // triggerToast({
        //   text: 'load',
        // });
      });
    }
    if (typeof onBlur === 'function') {
      window.addEventListener('blur', () => {
        onBlur();
        // triggerToast({
        //   text: 'blur',
        // });
      });
    }
    if (typeof onOffline === 'function') {
      window.addEventListener('offline', () => {
        onOffline();
        triggerToast({
          variant: 'error',
          icon: faWifiSlash,
          text: 'No connection.',
        });
      });
    }
    if (typeof onUnload === 'function') {
      window.addEventListener('unload', () => {
        onUnload();
        // triggerToast({
        //   text: 'unload',
        // });
      });
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
