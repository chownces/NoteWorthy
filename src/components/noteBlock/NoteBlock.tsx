import React from 'react';
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableStateSnapshot
} from 'react-beautiful-dnd';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Icon } from 'semantic-ui-react';

import ContextMenuElement, { ContextMenuType } from '../contextMenu/ContextMenuElement';
import NoteBlockContentEditable from './NoteBlockContentEditable';

export type NoteBlockProps = NoteBlockStateProps & NoteBlockHandlerProps & OwnProps;

export type NoteBlockStateProps = {
  id: string;
  html: string;
  tag: string;
};

export type NoteBlockHandlerProps = {
  updatePage(updatedBlock: NoteBlockStateProps): void;
  addBlock(currentBlockId: string, ref: React.RefObject<HTMLElement>): void;
  deleteBlock(currentBlockId: string, ref: React.RefObject<HTMLElement>): void;
  setIsEditMode(bool: boolean, callback?: (newState?: boolean) => void): void;
};

type OwnProps = {
  innerRef: (element?: HTMLElement | null | undefined) => any;
  lastBlockRef?: React.RefObject<HTMLElement>;
  provided: DraggableProvided;
  draggableSnapshot: DraggableStateSnapshot;
  droppableSnapshot: DroppableStateSnapshot;
  isEditMode: boolean;
};

const NoteBlock: React.FC<NoteBlockProps> = props => {
  const noteBlockRef = React.useRef<HTMLElement>(null);

  /**
   * IMPT: Since we are tracking `blocks` state as a mutable ref instead of useState
   * (to prevent rerender which causes react-contenteditable cursor jumping),
   * props.updatePage does not trigger a rerender, and thus props are not updated.
   *
   * Hence, we also track the state as a mutable ref locally in this component so that
   * the react-contenteditable values passed into our change handlers are accurate.
   */
  const html = React.useRef<string>(props.html);

  // TODO: For future use when tag changes are implemented
  // const tag = React.useRef<string>(props.tag);

  const contextMenuProps = {
    context: ContextMenuType.BLOCK,
    renaming: false,
    currentName: '',
    id: props.id,
    createHandler: () => props.addBlock(props.id, noteBlockRef),
    deleteHandler: () => props.deleteBlock(props.id, noteBlockRef),
    updateNameHandler: () => {}
  };

  const [contentEditablePlaceholder, setContentEditablePlaceholder] = React.useState('');
  const [isHovering, setIsHovering] = React.useState(false);

  // This component is memoized as we do not want it to rerender when isHovering state is changed
  // This is to prevent cursor jumping when the hover exits the div, which sets isHovering to false.
  const NoteBlockContentEditableMemo = React.useMemo(
    () => (
      <NoteBlockContentEditable
        html={html}
        tag={props.tag}
        placeholder={contentEditablePlaceholder}
        disabled={!props.isEditMode}
        className={
          'noteblock-contenteditable' +
          (props.droppableSnapshot.isDraggingOver ? ' draggingOver' : '') +
          (props.draggableSnapshot.isDragging ? ' isDragging' : '')
        }
        id={props.id}
        updatePage={props.updatePage}
        noteBlockRef={noteBlockRef}
        addBlock={props.addBlock}
        deleteBlock={props.deleteBlock}
        setIsEditMode={props.setIsEditMode}
        setContentEditablePlaceholder={setContentEditablePlaceholder}
        lastBlockRef={props.lastBlockRef}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      props.id,
      props.tag,

      // props.html is intentionally left out here (is not used here anw), as we want to update
      // the cache without rerendering this NoteBlock from outside ContentEditable.
      // The local html ref here keeps the visuals up to date without the need for
      // cache html state to propagate down.

      // props.updatePage,
      // props.addBlock,
      // props.deleteBlock,

      // These ^ are also intentionally left out. This is because when the cache is updated,
      // NotePage rerenders, which causes these handlers to be redeclared.
      // They can be left out as there will not be any stale closure problem due to the way
      // these handlers were written.

      props.lastBlockRef,
      props.draggableSnapshot,
      props.droppableSnapshot,
      props.isEditMode,

      props.setIsEditMode,
      contentEditablePlaceholder
    ]
  );

  return (
    /**
     * NOTE: For any change in NoteBlock HTML structure, remember to update the various navigation handlers:
     * NotePage::addBlockHandler
     * NotePage::deleteBlockHandler
     * NoteBlock::onKeydownHandler (ArrowUp and ArrowDown)
     */
    <ContextMenuTrigger id={props.id} holdToDisplay={1000}>
      <div
        className="noteblock"
        ref={props.innerRef}
        {...props.provided.dragHandleProps} // react-beautiful-dnd props
        {...props.provided.draggableProps} // react-beautiful-dnd props
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="noteblock-handle-container">
          <div className={'noteblock-handle' + (isHovering ? ' show-noteblock-handle' : '')}>
            {isHovering && <Icon name="ellipsis vertical" size="small" />}
          </div>
        </div>
        {NoteBlockContentEditableMemo}
        <ContextMenuElement {...contextMenuProps} />
      </div>
    </ContextMenuTrigger>
  );
};

export default NoteBlock;
