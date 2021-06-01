import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

import { Database } from './AllDatabasesContainer';

export type AllDatabasesProps = {
  databases: Database[];
  createDatabaseHandler: () => void;
  deleteDatabaseHandler: (databaseId: string) => void;
};

const AllDatabases: React.FC<AllDatabasesProps> = props => {
  // TODO: Probably want a react-beautiful-dnd view again for displaying all notes

  return (
    <>
      <div>This is the all databases page</div>
      <div>
        {props.databases.map((database: Database, index: number) => (
          <ContextMenuTrigger id={database.id}>
            <Link to={`/database/${database.id}`} key={index}>
              <div className="database-note">
                <p>{database.title}</p>
              </div>
            </Link>
            <ContextMenu id={database.id}>
              <Menu vertical>
                <MenuItem onClick={() => {}}>
                  <Menu.Item onClick={() => props.deleteDatabaseHandler(database.id)}>
                    <Icon name="trash alternate" />
                    Delete Database
                  </Menu.Item>
                  <Menu.Item onClick={() => props.createDatabaseHandler()}>
                    <Icon name="add" />
                    Add Database
                  </Menu.Item>
                </MenuItem>
              </Menu>
            </ContextMenu>
          </ContextMenuTrigger>
        ))}
      </div>
      <button onClick={props.createDatabaseHandler}>New Database</button>
    </>
  );
};

export default AllDatabases;
