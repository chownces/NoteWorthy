/**
 * Custom React hook to merge multiple refs into a single ref.
 *
 * This hook is from:
 * https://github.com/jaredLunde/react-hook/blob/master/packages/merged-ref/src/index.tsx
 */

// TODO: This hook is currently unused due to change in NoteBlock structure
const useMergedRef = <T extends any>(...refs: React.Ref<T>[]): React.RefCallback<T> => (
  element: T
) =>
  refs.forEach(ref => {
    if (typeof ref === 'function') ref(element);
    else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = element;
  });

export default useMergedRef;
