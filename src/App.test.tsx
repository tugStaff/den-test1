import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders den-test1 Camera PWA heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/den-test1 Camera PWA/i);
  expect(headingElement).toBeInTheDocument();
});