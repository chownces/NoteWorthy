import { Form, Popup } from 'semantic-ui-react';

import { setEol } from '../../../utils/helpers';
import useStateCallback from '../../../utils/useStateCallback';
import { Category } from '../DatabaseContainer';

export type AddCategoryProps = {
  id: string;
  categories: Category[];
  createDatabaseCategoryHandler: (databaseId: string, categoryName: string, index: number) => void;
};

const AddCategoryPopup: React.FC<AddCategoryProps> = props => {
  const [open, setOpen] = useStateCallback(false);

  const onClose = (databaseId: string) => {
    const newCategory = (document.getElementById(databaseId) as HTMLInputElement).value.trim();

    if (props.categories.some(x => x.name === newCategory)) {
      alert('Category already exists');
    } else if (newCategory === '') {
      alert('Please input a category name');
    } else {
      props.createDatabaseCategoryHandler(props.id, newCategory, props.categories.length);
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
    setEol(document.getElementById(props.id) as HTMLElement);
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
      trigger={<button onClick={() => {}}>Add Category </button>}
    >
      <Form>
        <input
          id={props.id}
          onKeyDown={onEnterKey(props.id)}
          type="text"
          defaultValue={'New Category'}
        />
      </Form>
    </Popup>
  );
};

export default AddCategoryPopup;
