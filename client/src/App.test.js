import { render, screen } from '@testing-library/react';
import App from './App';

test('renders pg express books header', () => {
  render(<App />);
  const hOneElement = screen.getByText(/react books/i);
  expect(hOneElement).toBeInTheDocument();
});
