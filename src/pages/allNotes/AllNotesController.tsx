import { gql, useQuery } from '@apollo/client';
import React from 'react';

import AllNotes, { AllNotesProps } from './AllNotes';

// TODO: Clean up the various type exports...
// `blocks` is excluded here as we do not need it when displaying AllNotes for now.
export type Note = {
  _id: string;
  title: string;
  date: string;
};

const AllNotesController: React.FC = () => {
  // TODO: Handle repositioning of Note 'blocks' in AllNotes page

  const [notes, setNotes] = React.useState<Note[]>([]);

  // TODO: Change date to reflect the date and time of the latest changes (requires changes in backend)
  const GET_ALL_NOTES_QUERY = gql`
    {
      allNotes {
        _id
        title
        date
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_ALL_NOTES_QUERY);

  /**
   * This effect handles the rerendering of the page once data is fetched asynchronously.
   */
  React.useEffect(() => {
    if (!loading) {
      if (!error) {
        setNotes(data.allNotes);
      } else {
        // TODO: Handle request error (e.g. display message to user)
      }
    }
  }, [loading, error, data, setNotes]);

  const allNotesProps: AllNotesProps = {
    notes: notes
  };

  return <AllNotes {...allNotesProps} />;
};

export default AllNotesController;
