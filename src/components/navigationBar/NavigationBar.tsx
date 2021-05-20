import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { Icon, Image, Menu, Sidebar } from 'semantic-ui-react';

import brandLogo from '../../assets/brand_logo.png';

enum NavbarItems {
  allNotes,
  login,
  todos,
  contribute,
  boardView
}

const NavigationBar: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState<NavbarItems>(NavbarItems.allNotes);
  const [sidePanelOpen, setSidePanelOpen] = React.useState<boolean>(false);
  const isMobileBreakpoint = useMediaQuery({ maxWidth: 768 });

  const setActiveItemAndCloseSidePanel = (activeItem: NavbarItems) => {
    setActiveItem(activeItem);
    setSidePanelOpen(false);
  };

  // NOTE: We use Link instead of href inside Menu.item to prevent unnecessary page refresh
  const desktopMenuItems = (
    <>
      <Menu>
        <Link to="/" className="brand-logo-link">
          <Menu.Item
            as="div"
            active={false}
            onClick={() => setActiveItem(NavbarItems.allNotes)}
            className="brand-logo-container"
          >
            <Image src={brandLogo} size="small" />
          </Menu.Item>
        </Link>
        <Link to="/">
          <Menu.Item
            as="div"
            active={activeItem === NavbarItems.allNotes}
            onClick={() => setActiveItem(NavbarItems.allNotes)}
          >
            <Icon name="file alternate outline" />
            All Notes
          </Menu.Item>
        </Link>
        <Link to="/todos">
          <Menu.Item
            as="div"
            active={activeItem === NavbarItems.todos}
            onClick={() => {
              setActiveItem(NavbarItems.todos);
            }}
          >
            <Icon name="calendar check outline" />
            Todo List
          </Menu.Item>
        </Link>
        <Link to="/BoardView">
          <Menu.Item
            as="div"
            active={activeItem === NavbarItems.boardView}
            onClick={() => {
              setActiveItem(NavbarItems.boardView);
            }}
          >
            BoardView
          </Menu.Item>
        </Link>
        <Menu.Menu position="right">
          <Link to="/contribute">
            <Menu.Item
              as="div"
              active={activeItem === NavbarItems.contribute}
              onClick={() => setActiveItem(NavbarItems.contribute)}
            >
              Contribute
            </Menu.Item>
          </Link>
          <Link to="/login">
            <Menu.Item
              as="div"
              active={activeItem === NavbarItems.login}
              onClick={() => setActiveItem(NavbarItems.login)}
            >
              Login
            </Menu.Item>
          </Link>
        </Menu.Menu>
      </Menu>
    </>
  );

  const mobileTopMenuItems = (
    <Menu>
      <Menu.Item as="a" onClick={() => setSidePanelOpen(true)}>
        <Icon name="bars" />
      </Menu.Item>
    </Menu>
  );

  const mobileSideMenuItems = (
    <Sidebar
      as={Menu}
      animation="overlay"
      onHide={() => setSidePanelOpen(false)}
      visible={sidePanelOpen}
      vertical
    >
      <Link to="/">
        <Menu.Item
          as="div"
          active={activeItem === NavbarItems.allNotes}
          onClick={() => setActiveItemAndCloseSidePanel(NavbarItems.allNotes)}
        >
          <Icon name="file alternate outline" />
          All Notes
        </Menu.Item>
      </Link>
      <Link to="/todos">
        <Menu.Item
          as="div"
          active={activeItem === NavbarItems.todos}
          onClick={() => setActiveItemAndCloseSidePanel(NavbarItems.todos)}
        >
          <Icon name="calendar check outline" />
          Todo List
        </Menu.Item>
      </Link>
      <Link to="/contribute">
        <Menu.Item
          as="div"
          active={activeItem === NavbarItems.contribute}
          onClick={() => setActiveItemAndCloseSidePanel(NavbarItems.contribute)}
        >
          Contribute
        </Menu.Item>
      </Link>
      <Link to="/login">
        <Menu.Item
          as="div"
          active={activeItem === NavbarItems.login}
          onClick={() => setActiveItemAndCloseSidePanel(NavbarItems.login)}
        >
          Login
        </Menu.Item>
      </Link>
    </Sidebar>
  );

  return (
    <>
      {isMobileBreakpoint ? (
        <>
          {mobileTopMenuItems}
          {mobileSideMenuItems}
        </>
      ) : (
        desktopMenuItems
      )}
    </>
  );
};

export default NavigationBar;
