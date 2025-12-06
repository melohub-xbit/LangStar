import '@testing-library/jest-dom';

const originalWarn = console.warn;
console.warn = (...args) => {
    if (
        typeof args[0] === 'string' &&
        (args[0].includes('React Router Future Flag Warning') ||
            args[0].includes('v7_startTransition') ||
            args[0].includes('v7_relativeSplatPath'))
    ) {
        return;
    }
    originalWarn(...args);
};

const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('not wrapped in act')
  ) {
    return;
  }
  originalError(...args);
};
