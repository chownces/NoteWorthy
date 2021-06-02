import { Form, Menu, Popup } from 'semantic-ui-react';

import { setEol } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';
import { RenameDatabaseProps } from './AllDatabases';

const RenameDatabasePopup: React.FC<RenameDatabaseProps> = props => {
  const [open, setOpen] = useStateCallback(false);

  // Updates title after enter key pressed in popup form
  const onEnterKey = (databaseId: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      props.updateDatabaseTitleHandler(
        databaseId,
        (document.getElementById(databaseId + 'rename') as HTMLInputElement).value
      );
      setOpen(false);
    }
  };

  // Callback to set line after popup opens
  const setLine = () => {
    setEol(document.getElementById(props.database.id + 'rename') as HTMLElement);
  };

  return (
    <Popup
      on="click"
      open={open}
      onOpen={() => setOpen(true, setLine)}
      onClose={() => setOpen(false)}
      basic
      pinned
      trigger={<Menu.Item onClick={() => {}}>Rename Database </Menu.Item>}
    >
      <Form>
        <input
          id={props.database.id + 'rename'}
          onKeyDown={onEnterKey(props.database.id)}
          type="text"
          defaultValue={props.database.title}
        />
      </Form>
    </Popup>
  );
};

export default RenameDatabasePopup;
