import { shallow } from 'enzyme';

import NoteBlock, { NoteBlockProps } from '../NoteBlock';

test('NoteBlock renders correctly with <p> tag', () => {
  const props: NoteBlockProps = {
    id: '1',
    html: 'Hello World!',
    tag: 'p',
    isEditMode: false,
    children: [],
    previousBlockGetter: () => undefined,
    nextBlockGetter: () => undefined,
    indentBlock: () => {},
    updatePage: () => {},
    addBlock: () => {},
    deleteBlock: () => {},
    setIsEditMode: () => {},
    innerRef: () => {},
    // TODO: Check if this is redundant, or if there is a better way.
    provided: {
      innerRef(element?: HTMLElement | null) {},
      draggableProps: {
        'data-rbd-draggable-context-id': '',
        'data-rbd-draggable-id': ''
      }
    }
  };
  const tree = shallow(<NoteBlock {...props} />);
  expect(tree.debug()).toMatchSnapshot();
});

// TODO: Add tests for other types of tags in the future
