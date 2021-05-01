import { BrowserRouter, Route } from 'react-router-dom';

import NotePageController from '../../pages/notePage/NotePageController';

type ApplicationProps = {};

const Appplication: React.FC<ApplicationProps> = props => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={NotePageController} />
      {/* <Route path="/newnote" component={} /> */}
    </BrowserRouter>
  );
};

export default Appplication;
