import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';

import ContextMenuElement, {
  ContextMenuType
} from '../../components/contextMenu/ContextMenuElement';
import { Category, Database, DatabaseProps, DatabaseViews, Note } from './DatabaseTypes';

const TableDatabase: React.FC<DatabaseProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)
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

  const createNoteHandler = (categoryId: string ,title: string, index: number) => {
    const notesCopy: Note[] = props.notes.map(note => note);

    const newNote : Note = {
      userId: 'temp_userId',
      databaseId: props.id,
      id: 'temp_id',
      categoryId: categoryId,
      title: title,
      blocks: [{
        id:'',
        html:'',
        tag:''
      }],
      creationDate: Date.now().toString(),
      latestUpdate: Date.now().toString()
    };

    notesCopy.splice(index, 0, newNote);
    
    const categoriesCopy: Category[] = props.categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, notes: cat.notes.splice(cat.notes.length, 0, 'temp_id') };
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

    props.createNoteHandler(categoryId, title, index, databaseCopy);

  }

  const contextMenuProps = (note: Note, index: number) => {
    return {
      context: ContextMenuType.NOTE,
      renaming: true,
      currentName: note.title,
      id: note.id,
      createHandler: () => createNoteHandler(note.categoryId, 'untitled', index + 1),
      deleteHandler: () => deleteNoteHandler,
      updateNameHandler: props.updateNoteTitleHandler
    };
  };

  return (
    <>
      <button onClick={() => props.updateDatabaseViewHandler(props.id, DatabaseViews.BOARD)}>
        go to board view
      </button>

      <button
        onClick={() =>
          createNoteHandler(props.nonCategorisedId, 'untitled', props.notes.length)
        }
      >
        Create Note
      </button>
      <div>
        {props.notes.map((note: Note, index: number) => (
          <ContextMenuTrigger id={note.id} holdToDisplay={1000} key={note.id}>
            <Link to={`/note/${note.id}`} key={note.id}>
              <div className="database-note">
                <p>Title: {note.title}</p>
                <p>Latest Update: {new Date(note.latestUpdate).toDateString()}</p>
              </div>
            </Link>

            <ContextMenuElement {...contextMenuProps(note, index)} />
          </ContextMenuTrigger>
        ))}
      </div>
    </>
  );
};

export default TableDatabase;
