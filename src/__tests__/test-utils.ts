import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Re-export everything
export * from '@testing-library/react';
export { userEvent };

// Add a dummy test to make Jest happy
describe('Test utils', () => {
  test('should be importable', () => {
    expect(true).toBe(true);
  });
}); 