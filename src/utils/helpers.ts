/**
 * Unique block id generator
 *
 * TODO: Should shift this id generation to the backend.
 */
export const uniqueId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * Sets cursor to end of line (EOL) of the current block
 */
export const setEol = (elem: HTMLElement | null | undefined): void => {
  // TODO: Use refs instead
  // if (elem) {
  //   const { selectionStart, selectionEnd } = elem.current!
  //   elem.current?.setSelectionRange(selectionStart, selectionEnd)
  // }
  if (elem) {
    // Get the EOL 'position' of elem
    const range = document.createRange();

    range.selectNodeContents(elem);
    range.collapse(false); // collapse range to the end

    // Set the cursor to EOL 'position'
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges(); // clear all existing selections
      selection.addRange(range);
    }

    elem.focus();
  } else {
    console.log('Error in setting end of line for current block!');
  }
};

//Get caret startOffset, endOffset and node index for noteBlock
export const getCaretPosition = (elem: HTMLElement | undefined | null) => {
  const isSupported = typeof window.getSelection !== 'undefined';

  if (isSupported) {
    const selection = window.getSelection();

    console.log(selection?.anchorNode);
    const anchorNode = selection?.anchorNode;

    let num = -1;
    if (elem) {
      elem.childNodes.forEach((node, index) => {
        if (node === anchorNode) {
          num = index;
        }
      });
    }
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      return [range.startOffset, range.endOffset, num];
    }
  }
  return undefined;
};

//set cursor position, using given startOffset and node index for noteblock childNodes
export const setCaret = (
  elem: HTMLElement | null | undefined,
  startOffset: number | undefined,
  index: number
): void => {
  if (elem) {
    if (index <= 0 && startOffset === 0) {
      elem.focus();
      return;
    }

    if (startOffset) {
      const newRange = document.createRange();

      newRange.setStart(elem.childNodes[index], startOffset);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges(); // clear all existing selections
        selection.addRange(newRange);
      }
      elem.focus();
    }
  }
};

/**
 * Toggles bold text in current window selection
 */
export const toggleBold = (elem: HTMLElement) => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  const bolded = document.createElement('strong');
  range?.surroundContents(bolded);

  // TODO: Handle cursor shift to the end of selection when toggleBold is called
  // TODO: Handle untoggling also

  // selection.addRange(range);

  // range.selectNodeContents(elem);
};
