import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Button, Header, Icon } from 'semantic-ui-react';

import { BoardViewDraggableType } from '../BoardDatabase';
import BoardItem from '../boardDatabaseComponents/BoardItem';
import { Category, Note } from '../DatabaseTypes';

export type CategoryColumnProps = {
  index: number;
  databaseId: string;
  notes: Note[];
  category: Category;
  deleteDatabaseCategoryHandler: (databaseId: string, categoryId: string) => void;
  createNoteHandler: (categoryId: string, title: string, index: number) => void;
  deleteNoteHandler: (noteId: string) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
};

const CategoryColumn: React.FC<CategoryColumnProps> = props => {
  const deleteCategory = (databaseId: string, categoryId: string) => {
    if (props.category.name === 'Non-categorised') {
      alert('Cannot delete this category!');
    } else {
      props.deleteDatabaseCategoryHandler(databaseId, categoryId.trim());
    }
  };

  return (
    <Draggable draggableId={props.category.id} index={props.index} key={props.category.name}>
      {provided => (
        <div
          className="column"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Header as="h5" textAlign="center">
            {props.category.name}
            <Icon
              name="close"
              size="mini"
              onClick={() => deleteCategory(props.databaseId, props.category.id)}
            />
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
