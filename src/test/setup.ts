import "@testing-library/jest-dom";

// jsdom does not implement ResizeObserver (needed by input-otp).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as typeof ResizeObserver;

// jsdom does not implement elementFromPoint (used by input-otp).
document.elementFromPoint ??= () => null;
