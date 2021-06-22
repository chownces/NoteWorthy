import { ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';

import ContextMenuElement from '../../components/contextMenu/ContextMenuElement';
import { Database } from './AllDatabasesContainer';

export type AllDatabasesProps = {
  databases: Database[];
  createDatabaseHandler: () => void;
  deleteDatabaseHandler: (databaseId: string) => void;
  updateDatabaseTitleHandler: (databaseId: string, title: string) => void;
};

export type RenameDatabaseProps = {
  database: Database;
  updateDatabaseTitleHandler: (databaseId: string, title: string) => void;
};

const AllDatabases: React.FC<AllDatabasesProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes
  const updatedLinkHandler = (database: Database) => {
    if (database.currentView === 'table') {
      // return `/tableDatabase/${database.id}`;
      return `/${database.id}`;
    } else {
      // return `/boardDatabase/${database.id}`;
      return `/${database.id}`;
    }
  };

  const contextMenuProps = (database: Database, index: number) => {
    return {
      context: 'Database',
      renaming: true,
      currentName: database.title,
      id: database.id,
      key: database.id,
      createHandler: props.createDatabaseHandler,
      deleteHandler: () => props.deleteDatabaseHandler(database.id),
      updateNameHandler: props.updateDatabaseTitleHandler
    };
  };

  return (
    <>
      <div>This is the all databases page</div>
      <div>
        {props.databases.map((database: Database, index: number) => (
          <ContextMenuTrigger id={database.id} holdToDisplay={1000} key={index}>
            <Link to={updatedLinkHandler(database)} key={index}>
              <div className="database-note">
                <p>{database.title}</p>
              </div>
            </Link>
            <ContextMenuElement {...contextMenuProps(database, index)} />
          </ContextMenuTrigger>
        ))}
      </div>
      <button onClick={props.createDatabaseHandler}>New Database</button>
    </>
  );
};

export default AllDatabases;
