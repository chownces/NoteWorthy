import { render } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { MemoryRouter } from 'react-router-dom';

import NavigationBar from '../NavigationBar';

test('Navigation Bar renders correctly at desktop breakpoint', () => {
  const { container: desktop } = render(
    <ResponsiveContext.Provider value={{ width: 1000 }}>
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>
    </ResponsiveContext.Provider>
  );
  expect(desktop).toMatchSnapshot();
});

test('Navigation Bar renders correctly at mobile breakpoint', () => {
  const { container: mobile } = render(
    <ResponsiveContext.Provider value={{ width: 600 }}>
      <MemoryRouter>
        <NavigationBar />
      </MemoryRouter>
    </ResponsiveContext.Provider>
  );
  expect(mobile).toMatchSnapshot();
});
