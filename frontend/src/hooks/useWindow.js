import { useLayoutEffect } from 'react';
import { triggerToast } from 'components/Toast';
import { faWifi, faWifiSlash } from '@fortawesome/pro-regular-svg-icons';

const useWindow = (
  { onMount, onFocus, onBlur, onOnline, onOffline, onLoad, onUnload },
  deps
) => {
  useLayoutEffect(() => {
    if (typeof onMount === 'function') {
      onMount();
    }
    if (typeof onFocus === 'function') {
      window.addEventListener('focus', onFocus);
    }
    if (typeof onLoad === 'function') {
      window.addEventListener('load', onLoad);
    }
    if (typeof onBlur === 'function') {
      window.addEventListener('blur', onBlur);
    }
    if (typeof onUnload === 'function') {
      window.addEventListener('unload', onUnload);
    }

    const handleOnOnline = () => {
      if (typeof onOnline === 'function') {
        onOnline();
        triggerToast({
          variant: 'success',
          icon: faWifi,
          text: 'Connected.',
        });
      }
    };
    const handleOnOffline = () => {
      if (typeof onOffline === 'function') {
        onOffline();
        triggerToast({
          variant: 'error',
          icon: faWifiSlash,
          text: 'No connection.',
        });
      }
    };

    if (typeof onOnline === 'function') {
      window.addEventListener('online', handleOnOnline);
    }
    if (typeof onOffline === 'function') {
      window.addEventListener('offline', handleOnOffline);
    }

    return () => {
      if (typeof onFocus === 'function') {
        window.removeEventListener('focus', onFocus);
      }
      if (typeof onLoad === 'function') {
        window.removeEventListener('load', onLoad);
      }
      if (typeof onBlur === 'function') {
        window.removeEventListener('blur', onBlur);
      }
      if (typeof onOnline === 'function') {
        window.removeEventListener('online', handleOnOnline);
      }
      if (typeof onOffline === 'function') {
        window.removeEventListener('offline', handleOnOffline);
      }
      if (typeof onUnload === 'function') {
        window.removeEventListener('unload', onUnload);
      }
    };
  }, deps || []);
};

export default useWindow;
