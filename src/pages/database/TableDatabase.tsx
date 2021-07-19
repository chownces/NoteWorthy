import React from 'react';
import ContentEditable from 'react-contenteditable';

import { ContextMenuType } from '../../components/contextMenu/ContextMenuElement';
import { DatabaseProps, DatabaseViews, Note } from './DatabaseTypes';
import TableRow from './tableDatabaseComponents/tableRow';

const TableDatabase: React.FC<DatabaseProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)

  const databaseTitle = React.useRef(props.title);
  const hasUnsavedChangesTitle = React.useRef(false);
  React.useEffect(() => {
    const interval = window.setInterval(() => {
      if (hasUnsavedChangesTitle.current) {
        props.updateDatabaseTitleHandler(databaseTitle.current);
        hasUnsavedChangesTitle.current = false;
      }
    }, 800);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="database">
      <button onClick={() => props.updateDatabaseViewHandler(props.id, DatabaseViews.BOARD)}>
        go to board view
      </button>

      <button
        onClick={() =>
          props.createNoteHandler(props.nonCategorisedId, 'untitled', props.notes.length)
        }
      >
        Create Note
      </button>
      <ContentEditable
        className="database-title"
        tagName="h1"
        html={databaseTitle.current}
        onChange={e => {
          hasUnsavedChangesTitle.current = true;
          databaseTitle.current = e.target.value;
        }}
      />
      <div>
        {props.notes.map((note: Note, index: number) => (
          <TableRow note={note} contextMenuProps={contextMenuProps(note, index)} key={note.id} />
        ))}
      </div>
    </div>
  );
};

export default TableDatabase;
