import { Link } from 'react-router-dom';

import { Database } from './AllDatabasesController';

export type AllDatabasesProps = {
  databases: Database[];
};

const AllDatabases: React.FC<AllDatabasesProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  return (
    <div>
      {props.databases.map((database: Database, index: number) => (
        <Link to={`note/${database.id}`} key={index}>
          <div className="allnotes-note">
            <p>{database.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AllDatabases;
