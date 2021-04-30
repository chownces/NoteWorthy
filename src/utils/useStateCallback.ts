import React from 'react';

/**
 * Custom React hook to replicate the setState callback in React Class Components.
 *
 * This hook is similar to React.useState, but its update state callback takes in
 * an additional optional callback parameter, which is called after the new state
 * has been set.
 */
function useStateCallback<T>(
  initialState: T
): [T, (newState: T, callback?: (newState?: T) => void) => void] {
  const [state, setState] = React.useState(initialState);
  const callbackRef = React.useRef<((newState?: T) => void) | null>(null);

  const setStateCallback = React.useCallback((newState, callback) => {
    setState(newState);
    callbackRef.current = callback;
  }, []);

  React.useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null; // Reset callback after execution
    }
  });

  return [state, setStateCallback];
}

export default useStateCallback;
