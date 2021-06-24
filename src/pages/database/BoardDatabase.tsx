import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Divider, Grid, Header } from 'semantic-ui-react';

import AddCategoryPopup from './boardDatabaseComponents/AddCategoryPopup';
import CategoryColumn from './boardDatabaseComponents/CategoryColumn';
import { Category, Database, DatabaseProps, DatabaseViews, Note } from './DatabaseTypes';

const BoardDatabase: React.FC<DatabaseProps> = props => {
  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)

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

      const categoriesCopy: Category[] = props.categories.map(cat => {
        return { ...cat, notes: [...cat.notes] };
      });

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
              ...note,
              categoryId: destination.droppableId
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

  const createNoteHandler = (categoryId: string, title: string, index: number) => {
    const notesCopy: Note[] = props.notes.map(note => note);

    const newNote: Note = {
      userId: 'temp_userId',
      databaseId: props.id,
      id: 'temp_id',
      categoryId: categoryId,
      title: title,
      blocks: [
        {
          id: '',
          html: '',
          tag: ''
        }
      ],
      creationDate: new Date(Date.now()).toDateString(),
      latestUpdate: new Date(Date.now()).toDateString()
    };

    notesCopy.splice(notesCopy.length, 0, newNote);

    const categoriesCopy: Category[] = props.categories.map(cat => {
      if (cat.id === categoryId) {
        const tempNotes = [...cat.notes];
        tempNotes.splice(index, 0, 'temp_id');
        return { ...cat, notes: tempNotes };
      } else {
        return { ...cat, notes: [...cat.notes] };
      }
    });

    console.log(categoriesCopy);

    const databaseCopy: Database = {
      id: props.id,
      title: props.title,
      currentView: props.currentView,
      categories: categoriesCopy,
      notes: notesCopy
    };

    props.createNoteHandler(categoryId, title, index, databaseCopy);
  };

  const deleteNoteHandler = (noteId: string) => {
    const notesCopy: Note[] = props.notes.filter(note => note.id !== noteId);

    const categoryId = props.notes.filter(note => note.id === noteId)[0].categoryId;
    const categoriesCopy: Category[] = props.categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, notes: cat.notes.filter(note => note !== noteId) };
      } else {
        return { ...cat, notes: [...cat.notes] };
      }
    });

    const databaseCopy: Database = {
      id: props.id,
      title: props.title,
      currentView: props.currentView,
      categories: categoriesCopy,
      notes: notesCopy
    };

    props.deleteNoteHandler(noteId, databaseCopy);
  };

  const categoryColumnProps = {
    databaseId: props.id,
    renaming: true,
    notes: props.notes,
    deleteDatabaseCategoryHandler: props.deleteDatabaseCategoryHandler,
    createNoteHandler: createNoteHandler,
    deleteNoteHandler: deleteNoteHandler,
    updateNoteTitleHandler: props.updateNoteTitleHandler
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <button onClick={() => props.updateDatabaseViewHandler(props.id, DatabaseViews.TABLE)}>
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
          <AddCategoryPopup {...props} />
        </Grid.Column>
      </Grid>
    </DragDropContext>
  );
};

export default BoardDatabase;
