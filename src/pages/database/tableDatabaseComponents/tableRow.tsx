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

  return (
    <ContextMenuTrigger id={note.id} holdToDisplay={-1}>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ position: 'relative', zIndex: -1 }}
      >
        {isHovering && <ContextMenuButton contextMenuProps={contextMenuProps} noteid={note.id} />}
        <Link to={`/note/${note.id}`} key={note.id}>
          <div className="table-database-note">
            <p>Title: {note.title}</p>
            <p>Latest Update: {new Date(note.latestUpdate).toDateString()}</p>
          </div>
        </Link>
      </div>
      <ContextMenuElement {...contextMenuProps} />
    </ContextMenuTrigger>
  );
};

export default TableRow;
