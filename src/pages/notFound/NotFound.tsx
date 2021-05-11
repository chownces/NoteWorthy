import { Header, Icon } from 'semantic-ui-react';

const NotFound: React.FC = () => {
  return (
    <Header as="h1" className="notfound-container">
      <div className="notfound-icon-group">
        <Icon name="frown outline" size="big" />
        <div className="notfound-header">404 Page not found</div>
      </div>
      <Header.Subheader>Alas, this note was not worthy...</Header.Subheader>
    </Header>
  );
};

export default NotFound;
