import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Jasmine compatibility shim for Jest
// Creates Jasmine-like spy objects that work with Jest
(global as any).jasmine = {
  createSpyObj: (baseName: string, methodNames: string[]) => {
    const obj: any = {};
    
    methodNames.forEach(method => {
      // Create a Jest mock function
      const mockFn = jest.fn();
      
      // Add Jasmine-like .and interface
      mockFn.and = {
        returnValue: (value: any) => {
          mockFn.mockReturnValue(value);
          return mockFn;
        },
        returnValues: (values: any[]) => {
          mockFn.mockReturnValueOnce(values[0]);
          return mockFn;
        },
        throwError: (error: any) => {
          mockFn.mockImplementation(() => {
            throw error;
          });
          return mockFn;
        },
        stub: () => mockFn,
        callThrough: () => mockFn
      };
      
      obj[method] = mockFn;
    });
    
    return obj;
  },
  objectContaining: (obj: any) => {
    return expect.objectContaining(obj);
  }
};

// Global spyOn function (alias for jest.spyOn)
(global as any).spyOn = jest.spyOn;

// Global fail function
(global as any).fail = (reason?: string) => {
  throw new Error(reason || 'Test failed');
};

// Global mocks
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance']
  })
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

// Mock window.alert for tests
(global.window as any).alert = jest.fn();
 
// Mock localStorage with a simple in-memory store and spyable methods
const _localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => {
    return Object.prototype.hasOwnProperty.call(_localStorageStore, key)
      ? _localStorageStore[key]
      : null;
  }),
  setItem: jest.fn((key: string, value: string) => {
    _localStorageStore[key] = String(value);
  }),
  removeItem: jest.fn((key: string) => {
    delete _localStorageStore[key];
  }),
  clear: jest.fn(() => {
    for (const k in _localStorageStore) {
      delete _localStorageStore[k];
    }
  }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Prevent jsdom navigation errors by mocking location.assign/replace and href setter
const locationMock: any = {
  ...window.location,
  assign: jest.fn(),
  replace: jest.fn(),
  href: '',
};
try {
  Object.defineProperty(window, 'location', { value: locationMock, writable: true });
} catch (e) {
  // some environments may not allow redefining location; fallback to mutate
  (window as any).location.assign = locationMock.assign;
  (window as any).location.replace = locationMock.replace;
}
