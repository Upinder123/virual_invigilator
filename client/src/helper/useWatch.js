import { useCallback, useEffect, useState } from 'react';

export default function useWatch(INITIAL_WATCHING_STATE) {
  const [watch, setWatch] = useState({
    watching: INITIAL_WATCHING_STATE,
    variant: null,
    detail: null,
    cheating: false,
  });
  const [hidden, setHidden] = useState('');
  const [visibilityChange, setVisibilityChange] = useState('');
  const [currentWindowWidth, setCurrentWindowWidth] = useState('');
  const [cheatingCount, setCheatingCount] = useState(0);

  useEffect(() => {
    console.log(watch, watch['watching']);
    console.log('cheating count:', cheatingCount);
  }, [watch, cheatingCount]);

  useEffect(() => {
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      setHidden('hidden');
      setVisibilityChange('visibilitychange');
    } else if (typeof document.msHidden !== 'undefined') {
      setHidden('msHidden');
      setVisibilityChange('msvisibilitychange');
    } else if (typeof document.webkitHidden !== 'undefined') {
      setHidden('webkitHidden');
      setVisibilityChange('webkitvisibilitychange');
    }

    setCurrentWindowWidth(window.innerWidth);

    return () => {
      'cleanup';
    };
  }, []);

  const checkZoom = useCallback(() => {
    const isAtMaxWidth = window.screen.availWidth - currentWindowWidth === 0;
    if (isAtMaxWidth) return;
    // alert("You minimized the window");
    if (watch['watching']) {
      console.log('You minimized the window');
      setWatch({
        watching: false,
        variant: cheatingCount < 3 ? 'warning' : 'danger',
        detail:
          'You minimized the window / You are trying to open multiple windows side by side',
        cheating: true,
      });
      setCheatingCount(c => c + 1);
      console.log('isAtMaxWidth:', isAtMaxWidth);
    }
  }, [watch, currentWindowWidth, cheatingCount]);

  const handleVisibilityChange = useCallback(() => {
    if (document[hidden] && watch['watching']) {
      console.log('You moved away!!! opened a new tab');
      setWatch({
        watching: false,
        variant: cheatingCount < 3 ? 'warning' : 'danger',
        detail: 'You moved away to a different tab/window',
        cheating: true,
      });
      setCheatingCount(c => c + 1);
      // videoElem  ent.pause();
    } else {
      // videoElement.play();
    }
  }, [hidden, watch, cheatingCount]);

  const checkPageFocus = useCallback(() => {
    if (!document.hasFocus() && watch['watching']) {
      // alert("You moved away!!!: changed Focus");
      console.log('You moved away!!!: changed Focus');
      setWatch({
        watching: false,
        variant: cheatingCount < 3 ? 'warning' : 'danger',
        detail: 'You changed focus',
        cheating: true,
      });
      setCheatingCount(c => c + 1);
    }
  }, [watch, cheatingCount]);

  useEffect(() => {
    let focusID = 0,
      zoomID = 0;

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (
      typeof document.addEventListener === 'undefined' ||
      hidden === undefined
    ) {
      console.log(
        'This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
      );
    } else {
      // Handle page visibility change
      document.addEventListener(
        visibilityChange,
        handleVisibilityChange,
        false
      );
      focusID = setInterval(checkPageFocus, 1000);
      zoomID = setInterval(checkZoom, 1000);
    }
    return () => {
      clearInterval(focusID);
      clearInterval(zoomID);
    };
  }, [
    hidden,
    visibilityChange,
    handleVisibilityChange,
    checkPageFocus,
    checkZoom,
  ]);

  useEffect(() => {
    if (watch.cheating) console.log('User has been detected cheating!!!');
  }, [watch]);

  return [watch, setWatch, setCheatingCount];
}
