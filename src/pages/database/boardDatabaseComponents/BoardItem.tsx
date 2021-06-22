import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import { Card, Label, List } from 'semantic-ui-react';

import ContextMenuElement from '../../../components/contextMenu/ContextMenuElement';
import { Category, Note } from '../DatabaseContainer';

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
    context: 'Note',
    renaming: true,
    currentName: props.note.title,
    id: props.note.id,
    createHandler: () => props.createNoteHandler(props.category.id, 'untitled', props.index),
    deleteHandler: () => props.deleteNoteHandler(props.note.id),
    updateNameHandler: props.updateNoteTitleHandler
  };
  return (
    <Draggable draggableId={props.note.id} index={props.index} key={props.note.id}>
      {provided => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          key={props.note.id}
          ref={provided.innerRef}
        >
          <ContextMenuTrigger id={props.note.id} holdToDisplay={-1}>
            <Card fluid className="cardi">
              <Link to={`/note/${props.note.id}`} key={props.note.id}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>{props.note.title}</Card.Header>
                    <Card.Description>
                      <List bulleted>
                        {props.note.blocks.map((block, index) =>
                          block.html === '' ? null : (
                            <List.Item style={{ lineHeight: '1.4285em' }} key={index}>
                              {console.log(block.html)}
                              {block.html}
                            </List.Item>
                          )
                        )}
                      </List>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Label> placeholder tag </Label>
                  </Card.Content>
                  <Card.Meta>Last update: {props.note.latestUpdate}</Card.Meta>
                </Card>
              </Link>
            </Card>

            <ContextMenuElement {...contextMenuProps} />
          </ContextMenuTrigger>
        </div>
      )}
    </Draggable>
  );
};
export default BoardItem;
