/**
 * Unique block id generator
 */
const uniqueId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * Sets cursor to end of line (EOL) of the current block
 */
const setEol = (elem: HTMLElement): void => {
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
};

/**
 * Toggles bold text in current window selection
 */
const toggleBold = (elem: HTMLElement) => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  const bolded = document.createElement('strong');
  range?.surroundContents(bolded);

  // TODO: Handle cursor shift to the end of selection when toggleBold is called

  // selection.addRange(range);

  // range.selectNodeContents(elem);
};

export { setEol, toggleBold, uniqueId };
