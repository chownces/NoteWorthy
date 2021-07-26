import { gql, useQuery } from '@apollo/client';
import ContentEditable from 'react-contenteditable';
import { Container, Icon, Label, Loader } from 'semantic-ui-react';

import { NoteBlockStateProps } from '../../components/noteBlock/NoteBlock';
import NotFound from '../notFound/NotFound';

export type SharedNoteProps = {
  hash: string;
};

const SharedNote: React.FC<SharedNoteProps> = props => {
  const { loading: queryLoading, error: queryError, data } = useQuery(
    GET_NOTE_BY_SHARED_LINK_HASH_QUERY,
    {
      variables: { hash: props.hash }
    }
  );

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    return <NotFound />;
  }

  const { title, blocks, latestUpdate, user } = data.getNoteBySharedLinkHash;

  return (
    <Container className="Notepage-container">
      <div className="Notepage">
        <div className="label-container">
          <Label color="black" basic>
            <Icon name="address card" />
            {`Author: ${user.firstname} ${user.lastname}`}
          </Label>
          <Label basic color="brown">
            <Icon name="edit" />
            {`Last updated: ${new Date(latestUpdate).toLocaleDateString()}`}
          </Label>
          <Label basic color="grey" className="print-button" onClick={() => window.print()}>
            <Icon name="print" />
            Print
          </Label>
        </div>
        <ContentEditable
          className="notepage-title"
          tagName="h1"
          html={title}
          disabled
          onChange={() => {}}
        />
        {blocks.map((e: NoteBlockStateProps, idx: number) => (
          <div className="noteblock" key={idx}>
            <div className="noteblock-handle-container"></div>
            <ContentEditable
              id={data.id}
              className="noteblock-contenteditable"
              html={e.html}
              tagName={e.tag}
              onChange={() => {}}
              disabled
            />
          </div>
        ))}
      </div>
    </Container>
  );
};

export const GET_NOTE_BY_SHARED_LINK_HASH_QUERY = gql`
  query getNoteBySharedLinkHash($hash: String!) {
    getNoteBySharedLinkHash(hash: $hash) {
      id
      title
      blocks {
        id
        html
        tag
      }
      user {
        firstname
        lastname
      }
      latestUpdate
    }
  }
`;

export default SharedNote;
