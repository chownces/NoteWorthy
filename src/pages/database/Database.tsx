import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Link, useHistory } from 'react-router-dom';
import { Button, Divider, Dropdown, Icon, Popup } from 'semantic-ui-react';

import ContextMenuElement, {
  ContextMenuType
} from '../../components/contextMenu/ContextMenuElement';
import BoardDatabase from './BoardDatabase';
import ContextMenuButton from './commonDatabaseComponents/contextMenuButton';
import { Category, Database as DatabaseType, DatabaseViews, Note } from './DatabaseTypes';
import TableDatabase from './TableDatabase';

export type DatabaseProps = {
  id: string;
  nonCategorisedId: string;
  title: string;
  currentView: string;
  categories: Category[];
  notes: Note[];
  databases: DatabaseType[];
  createDatabaseHandler: (index: number) => void;
  deleteDatabaseHandler: (databaseId: string) => void;
  createNoteHandler: (categoryId: string, title: string, index: number) => void;
  deleteNoteHandler: (noteId: string) => void;
  createDatabaseCategoryHandler: (databaseId: string, categoryName: string, index: number) => void;
  deleteDatabaseCategoryHandler: (databaseId: string, categoryId: string) => void;
  updateDatabaseCategoriesOrdering: (categories: Category[]) => void;
  updateCategoryName: (categoryId: string, name: string) => void;
  updateDatabaseViewHandler: (databaseId: string, view: string) => void;
  updateDatabaseTitleHandler: (databaseId: string, title: string) => void;
  updateNoteCategoryHandler: (
    noteId: string,
    categoryId: string,
    index: number,
    updatedDatabase: DatabaseType
  ) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
  updateDatabases: (databases: DatabaseType[]) => void;
};

const Database: React.FC<DatabaseProps> = props => {
  // TODO: Change note.date to reflect the latest date and time of update to the note (requires changes in backend)

  const history = useHistory();
  const currentId = React.useRef(props.id);

  const databaseTitle = React.useRef(props.title);
  const hasUnsavedChangesTitle = React.useRef(false);
  React.useEffect(() => {
    const interval = window.setInterval(() => {
      if (hasUnsavedChangesTitle.current) {
        props.updateDatabaseTitleHandler(currentId.current, databaseTitle.current);
        hasUnsavedChangesTitle.current = false;
      }
    }, 800);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = React.useState<boolean>(false);
  const [isLocked, setIsLocked] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [renamingOpen, setRenamingOpen] = React.useState<boolean>(false);
  const [hoveringEnum, setHoveringEnum] = React.useState<number>(-1);

  const onDragEndHandler = (result: DropResult) => {
    const reorder = (arr: DatabaseType[], startIndex: number, endIndex: number) => {
      const copy = [...arr];
      const [removed] = copy.splice(startIndex, 1);
      copy.splice(endIndex, 0, removed);

      return copy;
    };

    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newDatabases = reorder(props.databases, result.source.index, result.destination.index);

    props.updateDatabases(newDatabases);
    setIsDragging(false);
  };

  const contextMenuProps = (database: DatabaseType, index: number, nextLink: () => void) => {
    return {
      context: ContextMenuType.DATABASE,
      renaming: true,
      currentName: database.title,
      id: database.id,
      key: database.id,
      createHandler: () => props.createDatabaseHandler(index),
      deleteHandler: () => props.deleteDatabaseHandler(database.id),
      updateNameHandler: (databaseId: string, title: string) => {
        if (databaseId === props.id) {
          databaseTitle.current = title;
        }
        props.updateDatabaseTitleHandler(databaseId, title);
      },
      setRenamingOpen: setRenamingOpen,
      nextLink: nextLink,
      isSelfDelete: props.id === database.id,
      isLastElement: props.databases.length === 1
    };
  };

  return (
    <div className="database" key={props.id}>
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

        <Popup
          basic
          hoverable
          position="bottom left"
          flowing={false}
          open={open || renamingOpen || isDragging || isLocked}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          openOnTriggerClick={false}
          content={
            <DragDropContext
              onDragStart={() => {
                setIsDragging(true);
              }}
              onDragEnd={onDragEndHandler}
            >
              <Droppable droppableId="side-bar">
                {provided => (
                  <div
                    className="side-bar-menu"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="side-bar-header">{'Databases'}</div>

                    <Divider />

                    {props.databases.map((database: DatabaseType, index: number) => {
                      const nextLink =
                        index === props.databases.length - 1
                          ? () => history.push(`/database/${props.databases[0].id}`)
                          : () => history.push(`/database/${props.databases[index + 1].id}`);

                      return (
                        <Draggable draggableId={database.id} index={index} key={database.id}>
                          {(provided, draggableSnapshot) => (
                            <div
                              key={database.id}
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <div
                                className={draggableSnapshot.isDragging ? 'isDraggingSideBar' : ''}
                              >
                                <ContextMenuTrigger id={database.id} key={database.id}>
                                  <div
                                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                                    onMouseEnter={() => setHoveringEnum(index)}
                                    onMouseLeave={() => setHoveringEnum(-1)}
                                  >
                                    {hoveringEnum === index && (
                                      <ContextMenuButton
                                        contextMenuProps={contextMenuProps(
                                          database,
                                          index,
                                          nextLink
                                        )}
                                        id={database.id}
                                      />
                                    )}
                                    <Link
                                      className={
                                        hoveringEnum !== index ? 'space-right' : 'no-space'
                                      }
                                      to={`/database/${database.id}`}
                                      key={props.id}
                                      onClick={() => {
                                        databaseTitle.current = database.title;
                                        currentId.current = database.id;
                                      }}
                                      style={{ display: 'inline-block' }}
                                    >
                                      <ContentEditable
                                        className={
                                          database.id === props.id
                                            ? 'side-bar-selected'
                                            : 'side-bar-item'
                                        }
                                        html={
                                          database.id === props.id
                                            ? databaseTitle.current
                                            : database.title
                                        }
                                        onChange={() => {}}
                                        disabled
                                      />
                                    </Link>

                                    <div className="react-contextmenu-database">
                                      <ContextMenuElement
                                        {...contextMenuProps(database, index + 1, nextLink)}
                                      />
                                    </div>
                                  </div>
                                </ContextMenuTrigger>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div
                className="side-bar-add-button"
                onClick={() => props.createDatabaseHandler(props.databases.length + 1)}
              >
                <Icon name="add" />
                {'New database'}
              </div>
            </DragDropContext>
          }
          trigger={
            isLocked ? (
              <Button className="side-bar-button" icon="lock" onClick={() => setIsLocked(false)} />
            ) : (
              <Button
                className="side-bar-button"
                icon="sidebar"
                onClick={() => setIsLocked(true)}
              />
            )
          }
        />
        <Dropdown text={startCase(props.currentView) + ' View'}>
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
