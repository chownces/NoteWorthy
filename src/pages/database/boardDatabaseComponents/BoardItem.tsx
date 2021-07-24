import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import { Card, Label, List } from 'semantic-ui-react';

import ContextMenuElement, {
  ContextMenuType
} from '../../../components/contextMenu/ContextMenuElement';
import ContextMenuButton from '../commonDatabaseComponents/contextMenuButton';
import { Category, Note } from '../DatabaseTypes';

export type BoardItemProps = {
  index: number;
  category: Category;
  note: Note;
  createNoteHandler: (category: string, title: string, index: number) => void;
  deleteNoteHandler: (noteId: string) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
};

const BoardItem: React.FC<BoardItemProps> = props => {
  const contextMenuProps = {
    context: ContextMenuType.NOTE,
    renaming: true,
    currentName: props.note.title,
    id: props.note.id,
    createHandler: () => props.createNoteHandler(props.category.id, 'untitled', props.index),
    deleteHandler: () => props.deleteNoteHandler(props.note.id),
    updateNameHandler: props.updateNoteTitleHandler
  };

  const [isHovering, setIsHovering] = React.useState(false);

  const card = (
    <Card fluid className={'card' + (props.note.id === 'temp_id' ? ' card-disabled' : '')}>
      <Card.Content>
        <Card.Header className={props.note.id === 'temp_id' ? 'card-title-disabled' : ''}>
          {props.note.title}
        </Card.Header>
        <Card.Description className="card-description">
          <List bulleted>
            {/* Cap of 3 blocks displayed */}
            {props.note.blocks.map((block, index) =>
              index > 2 ? null : block.html === '' ? null : (
                <List.Item style={{ lineHeight: '1.4285em' }} key={index}>
                  <ContentEditable html={block.html} tagName="p" onChange={() => {}} disabled />
                </List.Item>
              )
            )}
          </List>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {/* TODO: Implement note tagging */}
        <Label> placeholder tag </Label>
      </Card.Content>
      <Card.Meta>Last update: {new Date(props.note.latestUpdate).toDateString()}</Card.Meta>
    </Card>
  );

  return props.note.id === 'temp_id' ? (
    card
  ) : (
    <Draggable draggableId={props.note.id} index={props.index} key={props.note.id}>
      {provided => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          key={props.note.id}
          ref={provided.innerRef}
        >
          <ContextMenuTrigger id={props.note.id} holdToDisplay={-1}>
            <div
              className="board-item"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isHovering && (
                <ContextMenuButton contextMenuProps={contextMenuProps} id={props.note.id} />
              )}
              <Link to={`/note/${props.note.id}`} key={props.note.id}>
                {card}
              </Link>
            </div>
            <ContextMenuElement {...contextMenuProps} />
          </ContextMenuTrigger>
        </div>
      )}
    </Draggable>
  );
};
export default BoardItem;
