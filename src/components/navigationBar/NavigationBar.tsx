import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Menu } from 'semantic-ui-react';

import brandLogo from '../../assets/brand_logo.png';

const NavigationBar: React.FC = () => {
  enum NavbarItems {
    allNotes,
    login,
    fakeLink
  }

  const [activeItem, setActiveItem] = React.useState<NavbarItems>(NavbarItems.allNotes);

  // NOTE: We use Link instead of href inside Menu.item to prevent unnecessary page refresh
  return (
    <Menu>
      {/* <Menu secondary> */}
      <Link to="/" style={{ display: 'flex' }}>
        <Menu.Item
          as="div"
          active={false}
          onClick={() => setActiveItem(NavbarItems.allNotes)}
          style={{ padding: '0 15px 2px 10px' }}
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
          All Notes
        </Menu.Item>
      </Link>
      <Link to="/hi">
        <Menu.Item
          as="div"
          active={activeItem === NavbarItems.fakeLink}
          onClick={() => {
            setActiveItem(NavbarItems.fakeLink);
          }}
        >
          Fake Link
        </Menu.Item>
      </Link>
      <Menu.Menu position="right">
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
  );
};

export default NavigationBar;
