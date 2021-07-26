import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, NavLink } from 'react-router-dom';
import { Icon, Image, Menu, Sidebar } from 'semantic-ui-react';

import brandLogo from '../../assets/brand_logo.png';
import userContext from '../userContext/UserContext';

const NavigationBar: React.FC = () => {
  const user = React.useContext(userContext);
  const [sidePanelOpen, setSidePanelOpen] = React.useState<boolean>(false);
  const isMobileBreakpoint = useMediaQuery({ maxWidth: 768 });

  const desktopMenuItems = (
    <>
      <Menu className="desktop-navbar">
        <Link to="/" className="brand-logo-link">
          <Menu.Item as="div" className="brand-logo-container">
            <Image src={brandLogo} size="small" />
          </Menu.Item>
        </Link>

        <Menu.Menu position="right">
          <NavLink to="/login" activeClassName="active">
            <Menu.Item as="div" onClick={user.logout}>
              {user.user.loggedIn ? 'Logout' : 'Login'}
            </Menu.Item>
          </NavLink>
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
      className="mobile-navbar"
      animation="overlay"
      onHide={() => setSidePanelOpen(false)}
      visible={sidePanelOpen}
      vertical
    >
      <NavLink exact to="/" activeClassName="active">
        <Menu.Item as="div" onClick={() => setSidePanelOpen(false)}>
          <Icon name="file alternate outline" />
          All Databases
        </Menu.Item>
      </NavLink>

      <NavLink to="/login" activeClassName="active">
        <Menu.Item
          as="div"
          onClick={() => {
            setSidePanelOpen(false);
            user.logout();
          }}
        >
          {user.user.loggedIn ? 'Logout' : 'Login'}
        </Menu.Item>
      </NavLink>
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
