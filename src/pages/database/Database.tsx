import { Link } from 'react-router-dom';

import { Note } from './DatabaseContainer';

export type DatabaseProps = {
  // TODO: Check if we can have a better typing for notes (see DatabaseContainer.tsx)
  notes: Note[];
};

const Database: React.FC<DatabaseProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)
  return (
    <div>
      {props.notes.map((note: Note, index: number) => (
        <Link to={`/note/${note.id}`} key={index}>
          <div className="database-note">
            <p>Title: {note.title}</p>
            <p>Latest Update: {note.latestUpdate}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Database;
