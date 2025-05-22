import '@testing-library/jest-dom';

// Mock for matchMedia which is not included in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    disconnect: jest.fn(),
  })),
});

// Mock for ResizeObserver which is not included in jsdom
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Add a dummy test to make Jest happy
describe('Setup tests', () => {
  test('should be importable', () => {
    expect(true).toBe(true);
  });
}); 