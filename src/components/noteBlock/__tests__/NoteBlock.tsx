import { shallow } from 'enzyme';

import NoteBlock, { NoteBlockProps } from '../NoteBlock';

test('NoteBlock renders correctly with <p> tag', () => {
  const props: NoteBlockProps = {
    id: '1',
    html: 'Hello World!',
    tag: 'p',
    updatePage: () => {},
    addBlock: () => {},
    deleteBlock: () => {}
  };
  const tree = shallow(<NoteBlock {...props} />);
  expect(tree.debug()).toMatchSnapshot();
});

// TODO: Add tests for other types of tags in the future
