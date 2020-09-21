function useTrapFocus() {
  let keyboardHandler;
  let element;

  function loopFocus(config) {
    if (!config) {
      console.warn('Could not initialize focus-trapping - Config Missing');
      return;
    }

    const FOCUSABLE_ELEMENT_SELECTORS =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex="0"], [contenteditable]';

    const KEY_CODE_MAP = {
      TAB: 9,
    };

    const { el, escCallback, focusElement } = config;
    element = el;

    if (!element) {
      console.warn('Could not initialize focus-trapping - Element Missing');
      return;
    }
    if (escCallback && !(escCallback instanceof Function)) {
      console.warn(
        'Could not initialize focus-trapping - `config.escCallback` is not a function'
      );
      return;
    }

    const focusableElements = element.querySelectorAll(
      FOCUSABLE_ELEMENT_SELECTORS
    );

    //There can be containers without any focusable element
    if (focusableElements.length > 0) {
      const firstFocusableEl = focusableElements[0],
        lastFocusableEl = focusableElements[focusableElements.length - 1],
        elementToFocus = focusElement ? focusElement : firstFocusableEl;
      elementToFocus.focus();

      keyboardHandler = function keyboardHandler(e) {
        if (e.keyCode === KEY_CODE_MAP.TAB) {
          //Rotate Focus
          if (e.shiftKey && document.activeElement === firstFocusableEl) {
            e.preventDefault();
            lastFocusableEl.focus();
          } else if (
            !e.shiftKey &&
            document.activeElement === lastFocusableEl
          ) {
            e.preventDefault();
            firstFocusableEl.focus();
          }
        }
      };
      element.addEventListener('keydown', keyboardHandler);
    }
  }

  function focusCleanUp() {
    if (keyboardHandler) {
      element.removeEventListener('keydown', keyboardHandler);
    }
  }

  return {
    loopFocus,
    focusCleanUp,
  };
}

export default useTrapFocus;
