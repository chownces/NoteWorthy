import { Link } from 'react-router-dom';

import { Note } from './AllNotesController';

export type AllNotesProps = {
  // TODO: Check if we can have a better typing for notes (see AllNotesController.tsx)
  notes: Note[];
};

const AllNotes: React.FC<AllNotesProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)
  return (
    <div>
      {props.notes.map((note: Note, index: number) => (
        <Link to={`note/${note._id}`} key={index}>
          <div className="allnotes-note">
            <p>{note.title}</p>
            <p>{note.date}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AllNotes;
