import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Icon, Table } from 'semantic-ui-react';

import { ContextMenuType } from '../../components/contextMenu/ContextMenuElement';
import { DatabaseProps } from './Database';
import { Note } from './DatabaseTypes';
import TableRow from './tableDatabaseComponents/tableRow';

const TableDatabase: React.FC<DatabaseProps> = props => {
  const [onHover, setOnHover] = React.useState<boolean>(false);

  const databaseTitle = React.useRef(props.title);
  const hasUnsavedChangesTitle = React.useRef(false);
  React.useEffect(() => {
    const interval = window.setInterval(() => {
      if (hasUnsavedChangesTitle.current) {
        props.updateDatabaseTitleHandler(props.id, databaseTitle.current);
        hasUnsavedChangesTitle.current = false;
      }
    }, 800);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextMenuProps = (note: Note, index: number) => {
    return {
      context: ContextMenuType.NOTE,
      renaming: true,
      currentName: note.title,
      id: note.id,
      createHandler: () => props.createNoteHandler(note.categoryId, 'untitled', index + 1),
      deleteHandler: () => props.deleteNoteHandler(note.id),
      updateNameHandler: props.updateNoteTitleHandler
    };
  };

  const nonCategorisedId = props.categories.map(category => category.id)[
    props.categories.map(category => category.name).indexOf('Non-categorised')
  ];

  const onDragEndHandler = (result: DropResult) => {
    const reorder = (arr: Note[], startIndex: number, endIndex: number) => {
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

    const newNotes = reorder(props.notes, result.source.index, result.destination.index);

    props.updateDatabaseNotesHandler(newNotes);
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId="table-view">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Table celled singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {props.notes.map((note: Note, index: number) => (
                  <TableRow
                    categories={props.categories}
                    note={note}
                    contextMenuProps={contextMenuProps(note, index)}
                    key={note.id}
                    index={index}
                    updateCategoryName={props.updateCategoryName}
                    updateNoteCategoryHandler={props.updateNoteCategoryHandler}
                    createDatabaseCategoryForCurrentNoteHandler={
                      props.createDatabaseCategoryForCurrentNoteHandler
                    }
                    database={props}
                    currentCategoryName={
                      props.categories[
                        props.categories.map(category => category.id).indexOf(note.categoryId)
                      ].name
                    }
                  />
                ))}
                {provided.placeholder}
                <Table.Row
                  active={onHover}
                  onMouseEnter={() => setOnHover(true)}
                  onMouseLeave={() => setOnHover(false)}
                  onClick={() =>
                    props.createNoteHandler(nonCategorisedId, 'untitled', props.notes.length + 1)
                  }
                  style={onHover ? { cursor: 'pointer' } : {}}
                >
                  <Table.Cell
                    style={onHover ? {} : { color: 'gray' }}
                    colSpan={3}
                    textAlign="center"
                  >
                    <Icon name="plus"></Icon>
                    New
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TableDatabase;
