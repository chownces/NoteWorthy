import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';

import ContextMenuElement, {
  ContextMenuType
} from '../../components/contextMenu/ContextMenuElement';
import { Category, Note } from './DatabaseContainer';

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
  deleteDatabaseCategoryHandler: (databaseId: string, category: string) => void;
  updateDatabaseViewHandler: (databaseId: string, view: string) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
};

export type RenameNoteProps = {
  note: Note;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
};

export type ChangeCategoryProps = {
  note: Note;
  updateNoteCategoryHandler: (noteId: string, category: string) => void;
};

const TableDatabase: React.FC<DatabaseProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)

  const contextMenuProps = (note: Note, index: number) => {
    return {
      context: ContextMenuType.NOTE,
      renaming: true,
      currentName: note.title,
      id: note.id,
      createHandler: () => props.createNoteHandler(note.categoryId, 'untitled', index + 1),
      deleteHandler: () => props.deleteNoteHandler(note.id),
      updateNameHandler: props.updateNoteTitleHandler
    };
  };

  return (
    <>
      {/* <Link to={`/boardDatabase/${props.id}`}>
        <button onClick={() => props.updateDatabaseViewHandler(props.id, 'board')}>
          go to board view
        </button>
      </Link> */}
      <button onClick={() => props.updateDatabaseViewHandler(props.id, 'board')}>
        go to board view
      </button>

      <button
        onClick={() =>
          props.createNoteHandler(props.nonCategorisedId, 'untitled', props.notes.length)
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
                <p>Latest Update: {note.latestUpdate}</p>
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
