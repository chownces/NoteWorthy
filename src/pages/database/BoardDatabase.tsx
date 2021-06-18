import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Divider, Grid, Header } from 'semantic-ui-react';

import AddCategoryPopup from './boardDatabaseComponents/AddCategoryPopup';
import CategoryColumn from './boardDatabaseComponents/CategoryColumn';
import { Category, Note } from './DatabaseContainer';

export type Database = {
  id: string;
  title: string;
  currentView: string;
  categories: Category[];
  notes: Note[];
};

export type DatabaseProps = {
  // TODO: Check if we can have a better typing for notes (see DatabaseContainer.tsx)
  id: string;
  nonCategorisedId: string;
  title: string;
  currentView: string;
  categories: Category[];
  notes: Note[];
  createNoteHandler: (categoryId: string, title: string, index: number) => void;
  deleteNoteHandler: (noteId: string) => void;
  createDatabaseCategoryHandler: (databaseId: string, categoryName: string, index: number) => void;
  deleteDatabaseCategoryHandler: (databaseId: string, categoryId: string) => void;
  updateDatabaseViewHandler: (databaseId: string, view: string) => void;
  updateNoteCategoryHandler: (
    noteId: string,
    categoryId: string,
    index: number,
    updatedDatabase: Database
  ) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
};

const BoardDatabase: React.FC<DatabaseProps> = props => {
  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)

  const categoriesCopier = (categories: Category[]) => {
    return categories.map(category => {
      const copy: Category = {
        id: category.id,
        name: category.name,
        notes: [...category.notes],
        databaseId: category.databaseId
      };
      return copy;
    });
  };

  const onDragEndHandler = React.useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return;
      }

      if (
        destination.index === result.source.index &&
        destination.droppableId === source.droppableId
      ) {
        return;
      }

      const categories = props.categories;
      const categoriesCopy = categoriesCopier(categories);

      const sourceCategory = categoriesCopy.filter(
        category => category.id === source.droppableId
      )[0];
      const [removed] = sourceCategory.notes.splice(source.index, 1);
      const destinationCategory = categoriesCopy.filter(
        category => category.id === destination.droppableId
      )[0];
      destinationCategory.notes.splice(destination.index, 0, removed);

      const notesCopy: Note[] = props.notes.map(note =>
        note.id === draggableId
          ? {
              userId: note.userId,
              databaseId: note.databaseId,
              id: note.id,
              categoryId: destination.droppableId,
              title: note.title,
              blocks: note.blocks,
              creationDate: note.creationDate,
              latestUpdate: note.latestUpdate
            }
          : note
      );

      const databaseCopy: Database = {
        id: props.id,
        title: props.title,
        currentView: props.currentView,
        categories: categoriesCopy,
        notes: notesCopy
      };

      props.updateNoteCategoryHandler(
        draggableId,
        destination.droppableId,
        destination.index,
        databaseCopy
      );
    },
    [props]
  );

  const categoryColumnProps = {
    databaseId: props.id,
    renaming: true,
    notes: props.notes,
    deleteDatabaseCategoryHandler: props.deleteDatabaseCategoryHandler,
    createNoteHandler: props.createNoteHandler,
    deleteNoteHandler: props.deleteNoteHandler,
    updateNoteTitleHandler: props.updateNoteTitleHandler
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <button onClick={() => props.updateDatabaseViewHandler(props.id, 'table')}>
        go to table view
      </button>
      <Header as="h1" textAlign="center" style={{ marginTop: '20px' }}>
        {props.title}
      </Header>
      <Divider></Divider>
      <Grid columns="equal">
        {props.categories.map((category, index) => (
          <CategoryColumn key={index} index={index} category={category} {...categoryColumnProps} />
        ))}

        <Grid.Column>
          <AddCategoryPopup
            {...{
              id: props.id,
              categories: props.categories,
              createDatabaseCategoryHandler: props.createDatabaseCategoryHandler
            }}
          />
        </Grid.Column>
      </Grid>
    </DragDropContext>
  );
};

export default BoardDatabase;
