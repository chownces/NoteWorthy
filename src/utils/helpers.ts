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

export const setSol = (elem: HTMLElement | null | undefined): void => {
  // TODO: Use refs instead
  // if (elem) {
  //   const { selectionStart, selectionEnd } = elem.current!
  //   elem.current?.setSelectionRange(selectionStart, selectionEnd)
  // }
  if (elem) {
    // Get the EOL 'position' of elem
    const range = document.createRange();

    range.selectNodeContents(elem);
    range.collapse(true); // collapse range to the start

    // Set the cursor to EOL 'position'
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges(); // clear all existing selections
      selection.addRange(range);
    }

    elem.focus();
  } else {
    console.log('Error in setting start of line for current block!');
  }
};

export const getNodeLength = (elem: HTMLElement | undefined | null) => {
  let [length, charCount]: [number, number | undefined] = [0, 0];
  if (elem) {
    elem.childNodes.forEach((node, index) => {
      // console.log(elem.childNodes.length);
      if (node.nodeValue && node.nodeValue?.length !== 0) {
        [length, charCount] = [index + 1, node.nodeValue?.length];
        // console.log(length, node.nodeValue);
      }
    });
  }

  return [length, charCount];
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

    // setCaret triggered when indenting, however, elem.childNodes[index] always set to undefined, crashing the app.
    // this may just be a temporary solution
    if (!elem.childNodes[index]) {
      return;
    }

    if (startOffset) {
      const newRange = document.createRange();

      console.log(elem.childNodes[index].nodeValue);
      const length = elem.childNodes[index].nodeValue?.length;
      if (length) {
        if (length > startOffset) {
          newRange.setStart(elem.childNodes[index], startOffset);
        } else {
          setEol(elem);
          return;
        }
      }

      // console.log(elem);
      // console.log(elem.childNodes[index]);

      // console.log(startOffset);

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
