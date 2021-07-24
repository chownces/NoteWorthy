import { hideMenu, showMenu } from 'react-contextmenu';
import { Button, Icon } from 'semantic-ui-react';

import ContextMenuElement from '../../../components/contextMenu/ContextMenuElement';

type ContextMenuButtonProps = {
  contextMenuProps: any;
  id: string;
};
const ContextMenuButton: React.FC<ContextMenuButtonProps> = props => {
  if (props.contextMenuProps.context === 'Note') {
    return (
      <Button
        className="context-menu-button"
        icon="ellipsis horizontal"
        basic
        onClick={e => {
          showMenu({
            position: { x: e.clientX, y: e.clientY },
            target: <ContextMenuElement {...props.contextMenuProps} />,
            id: props.id
          });
        }}
      />
    );
  } else {
    return (
      <button
        onClick={e => {
          const menu = <ContextMenuElement {...props.contextMenuProps} />;

          showMenu({
            position: { x: e.clientX, y: e.clientY },
            target: menu,
            id: props.id
          });

          hideMenu({ target: menu });
        }}
        className="context-menu-button-database"
      >
        <Icon
          name="ellipsis vertical"
          style={{
            display: 'inline'
          }}
        />
      </button>
    );
  }
};

export default ContextMenuButton;
