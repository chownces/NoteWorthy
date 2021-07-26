import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { Icon, Menu } from 'semantic-ui-react';

import RenamePopup from './RenamePopup';

export type ContextMenuProps = {
  context: ContextMenuType;
  renaming: boolean;
  currentName: string;
  id: string;
  createHandler: () => void;
  deleteHandler: () => void;
  updateNameHandler: (id: string, newName: string) => void;
  setPopupOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  nextLink?: () => void;
  isSelfDelete?: boolean;
  isLastElement?: boolean;
};

export enum ContextMenuType {
  BLOCK = 'Block',
  DATABASE = 'Database',
  NOTE = 'Note',
  CATEGORY = 'Category'
}

const ContextMenuElement: React.FC<ContextMenuProps> = props => {
  return (
    <ContextMenu id={props.id} hideOnLeave className="context-menu">
      <MenuItem>
        <Menu vertical>
          {props.renaming && (
            <RenamePopup
              context={props.context}
              id={props.id}
              currentName={props.currentName}
              updateNameHandler={props.updateNameHandler}
              setPopupOpen={props.setPopupOpen}
            />
          )}
          <Menu.Item
            onClick={() => {
              if (props.isLastElement) {
                alert('Cannot delete last ' + props.context + '!');
                return;
              }
              if (props.nextLink && props.isSelfDelete) {
                props.nextLink();
              }
              props.deleteHandler();
            }}
          >
            <Icon name="trash alternate" />
            {`Delete ${props.context}`}
          </Menu.Item>
          <Menu.Item onClick={() => props.createHandler()}>
            <Icon name="add" />
            {`Add ${props.context}`}
          </Menu.Item>
        </Menu>
      </MenuItem>
    </ContextMenu>
  );
};

export default ContextMenuElement;
