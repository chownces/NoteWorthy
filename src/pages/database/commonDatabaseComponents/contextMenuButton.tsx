import { showMenu } from 'react-contextmenu';
import { Button } from 'semantic-ui-react';

import ContextMenuElement from '../../../components/contextMenu/ContextMenuElement';

type ContextMenuButtonProps = {
  contextMenuProps: any;
  noteid: string;
};
const ContextMenuButton: React.FC<ContextMenuButtonProps> = props => {
  return (
    <Button
      className="context-menu-button"
      icon="ellipsis horizontal"
      basic
      onClick={e => {
        showMenu({
          position: { x: e.clientX, y: e.clientY },
          target: <ContextMenuElement {...props.contextMenuProps} />,
          id: props.noteid
        });
      }}
    />
  );
};

export default ContextMenuButton;
