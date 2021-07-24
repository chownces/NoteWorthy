import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';

import ContextMenuElement from '../../../components/contextMenu/ContextMenuElement';
import ContextMenuButton from '../commonDatabaseComponents/contextMenuButton';
import { Note } from '../DatabaseTypes';

type TableRowProps = {
  note: Note;
  contextMenuProps: any;
};
const TableRow: React.FC<TableRowProps> = props => {
  const [isHovering, setIsHovering] = React.useState(false);
  const { note, contextMenuProps } = props;

  const row = (
    <div
      className={'table-database-note' + (props.note.id === 'temp_id' ? ' table-row-disabled' : '')}
    >
      <p>Title: {note.title}</p>
      <p>Latest Update: {new Date(note.latestUpdate).toDateString()}</p>
    </div>
  );

  return props.note.id === 'temp_id' ? (
    row
  ) : (
    <ContextMenuTrigger id={note.id} holdToDisplay={-1}>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ position: 'relative' }}
      >
        {isHovering && <ContextMenuButton contextMenuProps={contextMenuProps} id={note.id} />}
        <Link to={`/note/${note.id}`} key={note.id}>
          {row}
        </Link>
      </div>
      <ContextMenuElement {...contextMenuProps} />
    </ContextMenuTrigger>
  );
};

export default TableRow;
