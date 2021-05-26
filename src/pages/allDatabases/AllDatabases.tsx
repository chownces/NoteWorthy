import { Link } from 'react-router-dom';

import { Database } from './AllDatabasesController';

export type AllDatabasesProps = {
  databases: Database[];
  createDatabaseHandler: () => void;
};

const AllDatabases: React.FC<AllDatabasesProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  return (
    <>
      <div>This is the all databases page</div>
      <div>
        {props.databases.map((database: Database, index: number) => (
          <Link to={`/database/${database.id}`} key={index}>
            <div className="database-note">
              <p>{database.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <button onClick={props.createDatabaseHandler}>New Database</button>
    </>
  );
};

export default AllDatabases;
