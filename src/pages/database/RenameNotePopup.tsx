import { Form, Menu, Popup } from 'semantic-ui-react';

import { setEol } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';
import { RenameNoteProps } from './Database';

const RenameNotePopup: React.FC<RenameNoteProps> = props => {
  const [open, setOpen] = useStateCallback(false);

  // Updates title after enter key pressed in popup form
  const onEnterKey = (noteId: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      props.updateNoteTitleHandler(
        noteId,
        (document.getElementById(noteId + 'rename') as HTMLInputElement).value
      );
      setOpen(false);
    }
  };

  // Callback to set line after popup opens
  const setLine = () => {
    setEol(document.getElementById(props.note.id + 'rename') as HTMLElement);
  };

  return (
    <Popup
      on="click"
      open={open}
      onOpen={() => setOpen(true, setLine)}
      onClose={() => setOpen(false)}
      basic
      pinned
      trigger={<Menu.Item onClick={() => {}}>Rename Note </Menu.Item>}
    >
      <Form>
        <input
          id={props.note.id + 'rename'}
          onKeyDown={onEnterKey(props.note.id)}
          type="text"
          defaultValue={props.note.title}
        />
      </Form>
    </Popup>
  );
};

export default RenameNotePopup;
