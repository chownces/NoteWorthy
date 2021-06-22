import { Form, Menu, Popup } from 'semantic-ui-react';

import { setEol } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';

export type RenameProps = {
  context: string;
  id: string;
  currentName: string;
  updateNameHandler: (id: string, newName: string) => void;
};

const RenameDatabasePopup: React.FC<RenameProps> = props => {
  const [open, setOpen] = useStateCallback(false);

  const onClose = (id: string) => {
    props.updateNameHandler(id, (document.getElementById(id) as HTMLInputElement).value.trim());
    setOpen(false);
  };

  // Updates title after enter key pressed in popup form
  const onEnterKey = (id: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onClose(id);
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
      onClose={() => onClose(props.id)}
      basic
      pinned
      trigger={<Menu.Item onClick={() => {}}>Rename {' ' + props.context} </Menu.Item>}
    >
      <Form>
        <input
          id={props.id}
          onKeyDown={onEnterKey(props.id)}
          type="text"
          defaultValue={props.currentName}
        />
      </Form>
    </Popup>
  );
};

export default RenameDatabasePopup;
