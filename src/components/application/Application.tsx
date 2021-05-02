import { BrowserRouter as Router, Route } from 'react-router-dom';

import AllNotesController from '../../pages/allNotes/AllNotesController';
import NotePageController from '../../pages/notePage/NotePageController';

type ApplicationProps = {};

const Appplication: React.FC<ApplicationProps> = props => {
  return (
    <Router>
      <Route exact path="/" component={AllNotesController} />
      <Route path="/note/:noteId" component={NotePageController} />
    </Router>
  );
};

export default Appplication;
