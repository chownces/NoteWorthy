import { useRef, useState } from 'react';
import { Form, Icon, Menu, Popup } from 'semantic-ui-react';

import { setEol } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';
import { ContextMenuType } from './ContextMenuElement';

export type CreateProps = {
  context: ContextMenuType;
  createHandler: (newName: string) => void;
  setPopupOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreatePopup: React.FC<CreateProps> = props => {
  const [open, setOpen] = useStateCallback(false);
  const [text, setText] = useState('New Category');
  const formRef = useRef(null);

  const onClose = () => {
    props.createHandler(text);
    if (props.setPopupOpen) {
      props.setPopupOpen(false);
    }
    setOpen(false);
  };

  // Updates title after enter key pressed in popup form
  const onEnterKey = () => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onClose();
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
        if (props.setPopupOpen) {
          props.setPopupOpen(true);
        }
        setOpen(true, setLine);
      }}
      onClose={() => onClose()}
      basic
      pinned
      trigger={
        <Menu.Item>
          <Icon name="plus" style={{ float: 'right' }} />
          {`New ${props.context}`}
        </Menu.Item>
      }
    >
      <Form>
        <input
          ref={formRef}
          onKeyDown={onEnterKey()}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </Form>
    </Popup>
  );
};

export default CreatePopup;
