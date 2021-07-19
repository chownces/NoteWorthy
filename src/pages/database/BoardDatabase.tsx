import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import { Divider } from 'semantic-ui-react';

import AddCategoryPopup from './boardDatabaseComponents/AddCategoryPopup';
import CategoryColumn from './boardDatabaseComponents/CategoryColumn';
import { Category, Database, DatabaseProps, DatabaseViews, Note } from './DatabaseTypes';

const BoardDatabase: React.FC<DatabaseProps> = props => {
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

  const onDragEndHandler = React.useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return;
      }

      if (
        destination.index === result.source.index &&
        destination.droppableId === source.droppableId
      ) {
        return;
      }

      const categoriesCopy: Category[] = props.categories.map(cat => {
        return { ...cat, notes: [...cat.notes] };
      });

      const sourceCategory = categoriesCopy.filter(
        category => category.id === source.droppableId
      )[0];
      const [removed] = sourceCategory.notes.splice(source.index, 1);
      const destinationCategory = categoriesCopy.filter(
        category => category.id === destination.droppableId
      )[0];
      destinationCategory.notes.splice(destination.index, 0, removed);

      const notesCopy: Note[] = props.notes.map(note =>
        note.id === draggableId
          ? {
              ...note,
              categoryId: destination.droppableId
            }
          : note
      );

      const databaseCopy: Database = {
        id: props.id,
        title: props.title,
        currentView: props.currentView,
        categories: categoriesCopy,
        notes: notesCopy
      };

      props.updateNoteCategoryHandler(
        draggableId,
        destination.droppableId,
        destination.index,
        databaseCopy
      );
    },
    [props]
  );

  const categoryColumnProps = {
    databaseId: props.id,
    renaming: true,
    notes: props.notes,
    deleteDatabaseCategoryHandler: props.deleteDatabaseCategoryHandler,
    createNoteHandler: props.createNoteHandler,
    deleteNoteHandler: props.deleteNoteHandler,
    updateNoteTitleHandler: props.updateNoteTitleHandler
  };

  return (
    <div className="database">
      <div className="board">
        <DragDropContext onDragEnd={onDragEndHandler}>
          <button onClick={() => props.updateDatabaseViewHandler(props.id, DatabaseViews.TABLE)}>
            go to table view
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
          <Divider className="divider" />
          <div className="board-items-container">
            {props.categories.map((category, index) => (
              <CategoryColumn
                key={index}
                index={index}
                category={category}
                {...categoryColumnProps}
              />
            ))}
            <div className="column">
              <AddCategoryPopup {...props} />
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardDatabase;
