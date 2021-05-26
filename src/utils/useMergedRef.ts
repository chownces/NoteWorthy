/**
 * Custom React hook to merge multiple refs into a single ref.
 *
 * This hook is referenced from:
 * https://github.com/jaredLunde/react-hook/blob/master/packages/merged-ref/src/index.tsx
 */

const useMergedRef = <T extends any>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> => (element: T) => {
  refs = refs.filter(ref => ref !== undefined);
  return refs.forEach(ref => {
    if (typeof ref === 'function') ref(element);
    else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = element;
  });
};

export default useMergedRef;
