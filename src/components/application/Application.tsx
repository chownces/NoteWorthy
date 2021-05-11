import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import AllNotesController from '../../pages/allNotes/AllNotesController';
import Login from '../../pages/login/Login';
import NotePageController from '../../pages/notePage/NotePageController';
import NotFound from '../../pages/notFound/NotFound';
import NavigationBar from '../navigationBar/NavigationBar';

type ApplicationProps = {};

const Application: React.FC<ApplicationProps> = props => {
  return (
    <>
      <NavigationBar />
      <Container>
        <Switch>
          <Route exact path="/" component={AllNotesController} />
          <Route path="/login" component={Login} />
          <Route path="/note/:noteId" component={NotePageController} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </>
  );
};

// TODO: Handle login and authentication
// const redirectToLogin = () => <Redirect to="/login" />;

export default Application;
