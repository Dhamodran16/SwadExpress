import { useEffect } from 'react';

const usePassiveEvents = () => {
  useEffect(() => {
    const addPassiveEventListener = () => {
      try {
        const options: AddEventListenerOptions = { passive: true };
        const wheelEvent: string = 'onwheel' in document ? 'wheel' : 'mousewheel';
        
        const noop = () => {};
        window.addEventListener('touchstart', noop, options);
        window.addEventListener(wheelEvent, noop, options);
        
        return () => {
          window.removeEventListener('touchstart', noop, options);
          window.removeEventListener(wheelEvent, noop, options);
        };
      } catch (e) {
        console.error('Passive events are not supported', e);
      }
    };

    const cleanup = addPassiveEventListener();
    return cleanup;
  }, []);
};

export default usePassiveEvents; 