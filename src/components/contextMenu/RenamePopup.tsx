import { useRef, useState } from 'react';
import { Form, Icon, Menu, Popup } from 'semantic-ui-react';

import { setEol } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';
import { ContextMenuType } from './ContextMenuElement';

export type RenameProps = {
  context: ContextMenuType;
  id: string;
  currentName: string;
  updateNameHandler: (id: string, newName: string) => void;
  setRenamingOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const RenamePopup: React.FC<RenameProps> = props => {
  const [open, setOpen] = useStateCallback(false);
  const [text, setText] = useState(props.currentName);
  const formRef = useRef(null);

  const onClose = (id: string) => {
    props.updateNameHandler(id, text);
    if (props.setRenamingOpen) {
      props.setRenamingOpen(false);
    }
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
    setEol(formRef.current);
  };

  return (
    <Popup
      on="click"
      open={open}
      onOpen={() => {
        if (props.setRenamingOpen) {
          props.setRenamingOpen(true);
        }
        setOpen(true, setLine);
      }}
      onClose={() => onClose(props.id)}
      basic
      pinned
      trigger={
        <Menu.Item>
          <Icon name="edit" style={{ float: 'right' }} />
          {`Rename ${props.context}`}
        </Menu.Item>
      }
    >
      <Form>
        <input
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

export default RenamePopup;
