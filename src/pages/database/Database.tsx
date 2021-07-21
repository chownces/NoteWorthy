import React from 'react';
import ContentEditable from 'react-contenteditable';
import { Divider, Dropdown } from 'semantic-ui-react';

import BoardDatabase from './BoardDatabase';
import { Category, Database as DatabaseType, DatabaseViews, Note } from './DatabaseTypes';
import TableDatabase from './TableDatabase';

export type DatabaseProps = {
  id: string;
  nonCategorisedId: string;
  title: string;
  currentView: string;
  categories: Category[];
  notes: Note[];
  createNoteHandler: (categoryId: string, title: string, index: number) => void;
  deleteNoteHandler: (noteId: string) => void;
  createDatabaseCategoryHandler: (databaseId: string, categoryName: string, index: number) => void;
  deleteDatabaseCategoryHandler: (databaseId: string, categoryId: string) => void;
  updateDatabaseCategoriesOrdering: (categories: Category[]) => void;
  updateDatabaseViewHandler: (databaseId: string, view: string) => void;
  updateDatabaseTitleHandler: (title: string) => void;
  updateNoteCategoryHandler: (
    noteId: string,
    categoryId: string,
    index: number,
    updatedDatabase: DatabaseType
  ) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
};

const Database: React.FC<DatabaseProps> = props => {
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

  return (
    <div className="database">
      <div className="sticky-top">
        <ContentEditable
          className="database-title"
          tagName="h1"
          html={databaseTitle.current}
          onChange={e => {
            hasUnsavedChangesTitle.current = true;
            databaseTitle.current = e.target.value;
          }}
        />
        <Dropdown className="view-dropdown" text={startCase(props.currentView) + ' View'}>
          <Dropdown.Menu>
            <Dropdown.Item
              text={props.currentView === DatabaseViews.TABLE ? 'Board View' : 'Table View'}
              value={
                props.currentView === DatabaseViews.TABLE
                  ? DatabaseViews.BOARD
                  : DatabaseViews.TABLE
              }
              onClick={(e, data) => {
                if (data.value === DatabaseViews.TABLE) {
                  props.updateDatabaseViewHandler(props.id, DatabaseViews.TABLE);
                } else if (data.value === DatabaseViews.BOARD) {
                  props.updateDatabaseViewHandler(props.id, DatabaseViews.BOARD);
                }
              }}
            />
          </Dropdown.Menu>
        </Dropdown>
        <Divider className="divider" />
      </div>
      {props.currentView === DatabaseViews.BOARD && <BoardDatabase {...props} />}
      {props.currentView === DatabaseViews.TABLE && <TableDatabase {...props} />}
    </div>
  );
};

const startCase = (word: string) => {
  return word[0].toUpperCase() + word.substring(1);
};

export default Database;
