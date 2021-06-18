import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { Icon, Menu } from 'semantic-ui-react';

import RenamePopup from './RenamePopup';

export type ContextMenuProps = {
  context: string;
  renaming: boolean;
  currentName: string;
  id: string;
  createHandler: () => void;
  deleteHandler: () => void;
  updateNameHandler: (id: string, newName: string) => void;
};

const ContextMenuElement: React.FC<ContextMenuProps> = props => {
  return (
    <ContextMenu id={props.id} className="context-menu">
      <MenuItem>
        <Menu vertical>
          <Menu.Item onClick={() => props.deleteHandler()}>
            <Icon name="trash alternate" />
            Delete {' ' + props.context}
          </Menu.Item>
          <Menu.Item onClick={() => props.createHandler()}>
            <Icon name="add" />
            Add {' ' + props.context}
          </Menu.Item>
          {props.renaming ? (
            <RenamePopup
              context={props.context}
              id={props.id}
              currentName={props.currentName}
              updateNameHandler={props.updateNameHandler}
            />
          ) : (
            <></>
          )}
        </Menu>
      </MenuItem>
    </ContextMenu>
  );
};

export default ContextMenuElement;
