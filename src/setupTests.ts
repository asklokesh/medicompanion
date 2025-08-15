import '@testing-library/jest-dom';

// Polyfill for Radix UI components in JSDOM environment
if (typeof window !== 'undefined') {
  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = function() { return false; };
  }
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = function() {};
  }
}
