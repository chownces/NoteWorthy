import { useRef, useState } from 'react';
import { Button, Form, Icon, Popup } from 'semantic-ui-react';

import { setEol } from '../../../utils/helpers';
import useStateCallback from '../../../utils/useStateCallback';
import { Category } from '../DatabaseTypes';

export type AddCategoryProps = {
  id: string;
  categories: Category[];
  createDatabaseCategoryHandler: (databaseId: string, categoryName: string, index: number) => void;
};

const AddCategoryPopup: React.FC<AddCategoryProps> = props => {
  const [open, setOpen] = useStateCallback(false);
  const [text, setText] = useState('New Category');
  const formRef = useRef(null);

  const onClose = (databaseId: string) => {
    const newCategory = text;

    if (props.categories.some(x => x.name === newCategory)) {
      alert('Category already exists');
    } else if (newCategory === '') {
      alert('Please input a category name');
    } else {
      props.createDatabaseCategoryHandler(props.id, newCategory, props.categories.length);
      setText('New Category');
    }

    setOpen(false);
  };

  // Updates title after enter key pressed in popup form
  const onEnterKey = (databaseId: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onClose(databaseId);
    }
  };

  // Callback to set line after popup opens
  const setLine = () => {
    setEol(formRef.current);
  };

  return (
    <Popup
      on="click"
      open={open}
      onOpen={() => setOpen(true, setLine)}
      onClose={() => {
        onClose(props.id);
      }}
      basic
      pinned
      trigger={
        <Button basic fluid className="new-category-button">
          <Icon name="plus" />
          Category
        </Button>
      }
    >
      <Form>
        <input
          id={props.id}
          ref={formRef}
          onKeyDown={onEnterKey(props.id)}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </Form>
    </Popup>
  );
};

export default AddCategoryPopup;
