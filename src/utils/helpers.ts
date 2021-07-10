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
    console.log('start' + range.startOffset);
    console.log('end' + range.endOffset);
    console.log(range);

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
