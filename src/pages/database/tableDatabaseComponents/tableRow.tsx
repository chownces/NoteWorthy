import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import { Divider, Dropdown, Ref, Table } from 'semantic-ui-react';

import ContextMenuElement, {
  ContextMenuType
} from '../../../components/contextMenu/ContextMenuElement';
import CreatePopup from '../../../components/contextMenu/CreatePopup';
import RenamePopup from '../../../components/contextMenu/RenamePopup';
import ContextMenuButton from '../commonDatabaseComponents/contextMenuButton';
import { Category, Database, Note } from '../DatabaseTypes';

type TableRowProps = {
  note: Note;
  contextMenuProps: any;
  categories: Category[];
  index: number;
  database: Database;
  updateCategoryName: (categoryId: string, name: string) => void;
  updateNoteCategoryHandler: (
    noteId: string,
    categoryId: string,
    index: number,
    updatedDatabase: Database
  ) => void;
  createDatabaseCategoryForCurrentNoteHandler: (
    databaseId: string,
    categoryName: string,
    noteId: string
  ) => void;
  currentCategoryName: string;
};

const TableRow: React.FC<TableRowProps> = props => {
  const [isHovering, setIsHovering] = React.useState(false);
  const { note, contextMenuProps } = props;
  const [open, setOpen] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);

  const changeCategoryOnClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: any
  ) => void = (e, data) => {
    if (typeof data.value === 'string') {
      const newCategories = [...props.categories];

      const currentCatIndex = newCategories
        .map(category => category.id)
        .indexOf(props.note.categoryId);

      const destionationCatIndex = newCategories.map(category => category.id).indexOf(data.value);

      newCategories[currentCatIndex] = { ...newCategories[currentCatIndex] };

      newCategories[currentCatIndex].notes = newCategories[currentCatIndex].notes.filter(
        note => note !== props.note.id
      );

      newCategories[destionationCatIndex] = { ...newCategories[destionationCatIndex] };

      newCategories[destionationCatIndex].notes = [...newCategories[destionationCatIndex].notes];
      newCategories[destionationCatIndex].notes.splice(
        newCategories[destionationCatIndex].notes.length + 1,
        0,
        props.note.id
      );

      const newNotes = [...props.database.notes];

      const newNote: Note = {
        ...note,
        categoryId: data.value
      };

      const noteIndex = newNotes.indexOf(note);

      newNotes[noteIndex] = newNote;

      props.updateNoteCategoryHandler(
        props.note.id,
        data.value,
        props.categories[destionationCatIndex].notes.length + 1,
        {
          ...props.database,
          categories: newCategories,
          notes: newNotes
        }
      );
    }
  };

  const row = (
    <Table.Row
      className={'table-database-note' + (props.note.id === 'temp_id' ? ' table-row-disabled' : '')}
    >
      <Table.Cell>{note.title}</Table.Cell>

      <Table.Cell>{new Date(note.latestUpdate).toDateString()}</Table.Cell>

      <Table.Cell>{props.currentCategoryName}</Table.Cell>
    </Table.Row>
  );

  const categoryOptions = props.categories.map(category => {
    return {
      key: category.id,
      value: category.id,
      text: category.name
    };
  });

  const renamePopup = (
    <RenamePopup
      context={ContextMenuType.CATEGORY}
      id={note.categoryId}
      currentName={props.currentCategoryName}
      setPopupOpen={setPopupOpen}
      updateNameHandler={props.updateCategoryName}
    />
  );

  return props.note.id === 'temp_id' ? (
    row
  ) : (
    <Draggable draggableId={note.id} index={props.index} key={note.id}>
      {provided => (
        <Ref
          key={note.id}
          innerRef={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Table.Row>
            <Table.Cell
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{ position: 'relative' }}
            >
              <ContextMenuTrigger id={note.id} holdToDisplay={-1}>
                <div className="context-menu-target">
                  <Link to={`/note/${note.id}`} key={note.id}>
                    {note.title}
                  </Link>
                  {isHovering && (
                    <ContextMenuButton contextMenuProps={contextMenuProps} id={note.id} />
                  )}
                </div>
                <ContextMenuElement {...contextMenuProps} />
              </ContextMenuTrigger>
            </Table.Cell>
            <Table.Cell>{new Date(note.latestUpdate).toDateString()}</Table.Cell>
            <Table.Cell style={{ overflow: 'visible' }}>
              <Dropdown
                fluid
                text={props.currentCategoryName}
                open={open || popupOpen}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                floating
                labeled
                className="category-drop-down"
              >
                <Dropdown.Menu scrolling style={{ position: 'absolute' }}>
                  <CreatePopup
                    context={ContextMenuType.CATEGORY}
                    setPopupOpen={setPopupOpen}
                    createHandler={(name: string) =>
                      props.createDatabaseCategoryForCurrentNoteHandler(
                        props.database.id,
                        name,
                        note.id
                      )
                    }
                  />

                  {props.currentCategoryName === 'Non-categorised' ? <></> : renamePopup}
                  <Divider />
                  {categoryOptions.map(option => (
                    <Dropdown.Item {...option} onClick={changeCategoryOnClick} />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Table.Cell>
          </Table.Row>
        </Ref>
      )}
    </Draggable>
  );
};

export default TableRow;
