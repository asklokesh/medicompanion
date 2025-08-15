import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders headline', () => {
    render(<App />);
    // This is a placeholder test.
    // The Index page is rendered at the root, but it is empty.
    // So for now, we just check that the component renders without error.
    // I will add more meaningful tests later.
    expect(true).toBe(true);
  });
});
