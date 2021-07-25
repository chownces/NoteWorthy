import * as qs from 'query-string';
import { RouteComponentProps } from 'react-router-dom';

import NotFound from '../notFound/NotFound';
import SharedNote from './SharedNote';

const SharedNoteContainer: React.FC<RouteComponentProps<{}>> = props => {
  const hash = props.location.hash;

  if (!hash) {
    return <NotFound />;
  }

  const parsedHash = qs.parse(hash);

  if (!parsedHash.sharing || Array.isArray(parsedHash.sharing)) {
    return <NotFound />;
  }

  return <SharedNote hash={parsedHash.sharing} />;
};

export default SharedNoteContainer;
