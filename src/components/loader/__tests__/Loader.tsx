import { render } from '@testing-library/react';

import Loader from '../Loader';

test('Loader component loads correctly', () => {
  const { container: tree } = render(<Loader />);
  expect(tree).toMatchSnapshot();
});
