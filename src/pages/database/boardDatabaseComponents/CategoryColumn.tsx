import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ContextMenu, ContextMenuTrigger, MenuItem, showMenu } from 'react-contextmenu';
import { Button, Header, Icon, Menu } from 'semantic-ui-react';

import { ContextMenuType } from '../../../components/contextMenu/ContextMenuElement';
import RenamePopup from '../../../components/contextMenu/RenamePopup';
import { BoardViewDraggableType } from '../BoardDatabase';
import BoardItem from '../boardDatabaseComponents/BoardItem';
import { Category, Note } from '../DatabaseTypes';

export type CategoryColumnProps = {
  index: number;
  databaseId: string;
  nonCategorisedId: string;
  notes: Note[];
  category: Category;
  deleteDatabaseCategoryHandler: (databaseId: string, categoryId: string) => void;
  createNoteHandler: (categoryId: string, title: string, index: number) => void;
  deleteNoteHandler: (noteId: string) => void;
  updateCategoryName: (categoryId: string, name: string) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
};

const CategoryColumn: React.FC<CategoryColumnProps> = props => {
  const columnMenu = (
    <ContextMenu id={props.category.id} hideOnLeave style={{ zIndex: 2 }}>
      <MenuItem>
        <Menu vertical compact>
          <Menu.Item
            onClick={() => props.deleteDatabaseCategoryHandler(props.databaseId, props.category.id)}
          >
            <Icon name="trash alternate" />
            Delete category
          </Menu.Item>
          <RenamePopup
            context={ContextMenuType.CATEGORY}
            id={props.category.id}
            currentName={props.category.name}
            updateNameHandler={props.updateCategoryName}
          />
        </Menu>
      </MenuItem>
    </ContextMenu>
  );

  return (
    <Draggable draggableId={props.category.id} index={props.index} key={props.category.name}>
      {provided => (
        <div
          className="column"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Header as="h5" textAlign="center" style={{ position: 'relative' }}>
            {props.category.name}
            {props.category.id !== props.nonCategorisedId && (
              <ContextMenuTrigger id={props.category.id} holdToDisplay={-1}>
                <Button
                  icon="ellipsis horizontal"
                  basic
                  floated="right"
                  style={{ boxShadow: 'none', position: 'absolute', top: '-2px', right: '0' }}
                  onClick={e => {
                    showMenu({
                      position: { x: e.clientX, y: e.clientY },
                      target: columnMenu,
                      id: props.category.id
                    });
                  }}
                />
                {columnMenu}
              </ContextMenuTrigger>
            )}
          </Header>
          <Droppable droppableId={props.category.id} type={BoardViewDraggableType.BOARD_ITEM}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ minHeight: '1px' }}
              >
                {props.category.notes.map((note: string, index: number) => (
                  <BoardItem
                    key={index}
                    index={index}
                    category={props.category}
                    note={props.notes.filter(x => x.id === note)[0]}
                    createNoteHandler={props.createNoteHandler}
                    deleteNoteHandler={props.deleteNoteHandler}
                    updateNoteTitleHandler={props.updateNoteTitleHandler}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Button
            fluid
            basic
            onClick={() =>
              props.createNoteHandler(props.category.id, 'untitled', props.category.notes.length)
            }
          >
            <Icon name="plus" />
            New
          </Button>
        </div>
      )}
    </Draggable>
  );
};

export default CategoryColumn;
