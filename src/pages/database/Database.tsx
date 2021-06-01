import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

import { Note } from './DatabaseContainer';

export type DatabaseProps = {
  // TODO: Check if we can have a better typing for notes (see DatabaseContainer.tsx)
  notes: Note[];
  createNoteHandler: () => void;
  deleteNoteHandler: (noteId: string) => void;  
};

const Database: React.FC<DatabaseProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)
  return (
    <>
      <div>
        {props.notes.map((note: Note, index: number) => (
          <ContextMenuTrigger id={note.id}>
            <Link to={`/note/${note.id}`} key={index}>
              <div className="database-note">
                <p>Title: {note.title}</p>
                <p>Latest Update: {note.latestUpdate}</p>
              </div>
            </Link>
            <ContextMenu id={note.id}>
              <Menu vertical>
                <MenuItem onClick={() => {}}>
                  <Menu.Item onClick={() => props.deleteNoteHandler(note.id)}>
                    <Icon name="trash alternate" />
                    Delete Note
                  </Menu.Item>
                  <Menu.Item onClick={() => props.createNoteHandler()}>
                    <Icon name="add" />
                    Add Note
                  </Menu.Item>
                </MenuItem>
              </Menu>
            </ContextMenu>
          </ContextMenuTrigger>
        ))}
      </div>
      <button onClick={props.createNoteHandler}>New Note</button>
    </>
  );
};

export default Database;
