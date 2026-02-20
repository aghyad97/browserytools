import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// ── localStorage ─────────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// ── navigator.clipboard ───────────────────────────────────────────────────────
// happy-dom defines navigator.clipboard as getter-only; use Object.defineProperty
// with a mutable object so we can reset individual fns in beforeEach.
const clipboardMock = {
  writeText: vi.fn().mockResolvedValue(undefined),
  readText: vi.fn().mockResolvedValue(""),
  write: vi.fn().mockResolvedValue(undefined),
  read: vi.fn().mockResolvedValue([]),
};
Object.defineProperty(navigator, "clipboard", {
  get: () => clipboardMock,
  configurable: true,
});

function resetClipboardMock() {
  clipboardMock.writeText = vi.fn().mockResolvedValue(undefined);
  clipboardMock.readText = vi.fn().mockResolvedValue("");
  clipboardMock.write = vi.fn().mockResolvedValue(undefined);
  clipboardMock.read = vi.fn().mockResolvedValue([]);
}

// ── navigator.mediaDevices ────────────────────────────────────────────────────
Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({}),
    enumerateDevices: vi.fn().mockResolvedValue([]),
    getDisplayMedia: vi.fn().mockResolvedValue({}),
  },
  writable: true,
  configurable: true,
});

// ── URL object methods ────────────────────────────────────────────────────────
global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
global.URL.revokeObjectURL = vi.fn();

// ── HTMLCanvasElement ─────────────────────────────────────────────────────────
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  drawImage: vi.fn(),
  getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
  putImageData: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 0 }),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  setTransform: vi.fn(),
  createImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
});
HTMLCanvasElement.prototype.toDataURL = vi
  .fn()
  .mockReturnValue("data:image/png;base64,mock");
HTMLCanvasElement.prototype.toBlob = vi
  .fn()
  .mockImplementation((callback: BlobCallback) => {
    callback(new Blob(["mock"], { type: "image/png" }));
  });

// ── FileReader ────────────────────────────────────────────────────────────────
class MockFileReader {
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  readyState = 0;
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onabort: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onloadend: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onloadstart: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onprogress: ((event: ProgressEvent<FileReader>) => void) | null = null;
  DONE = 2;
  EMPTY = 0;
  LOADING = 1;

  readAsDataURL(_blob: Blob) {
    this.result = "data:image/png;base64,mock";
    setTimeout(() => {
      if (this.onload)
        this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
      if (this.onloadend)
        this.onloadend({ target: this } as unknown as ProgressEvent<FileReader>);
    }, 0);
  }

  readAsText(_blob: Blob) {
    this.result = "mock text content";
    setTimeout(() => {
      if (this.onload)
        this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
      if (this.onloadend)
        this.onloadend({ target: this } as unknown as ProgressEvent<FileReader>);
    }, 0);
  }

  readAsArrayBuffer(_blob: Blob) {
    this.result = new ArrayBuffer(8);
    setTimeout(() => {
      if (this.onload)
        this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
      if (this.onloadend)
        this.onloadend({ target: this } as unknown as ProgressEvent<FileReader>);
    }, 0);
  }

  abort() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}
global.FileReader = MockFileReader as unknown as typeof FileReader;

// ── ResizeObserver ────────────────────────────────────────────────────────────
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};

// ── IntersectionObserver ──────────────────────────────────────────────────────
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
} as unknown as typeof IntersectionObserver;

// ── window.matchMedia ─────────────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
});

// ── Animation (for @number-flow/react) ───────────────────────────────────────
global.Animation = vi.fn() as unknown as typeof Animation;

// ── Pointer capture (for Radix UI Slider, Select, etc.) ──────────────────────
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// ── Module mocks ──────────────────────────────────────────────────────────────
vi.mock("sonner", () => {
  // toast must be callable (toast("msg")) AND have toast.success(), toast.error() etc.
  const toast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  });
  return { toast, Toaster: () => null };
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    void src;
    void alt;
    return null;
  },
}));

// ── Global beforeEach reset ───────────────────────────────────────────────────
beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  vi.clearAllMocks();
  // Re-apply clipboard mock after clearAllMocks (happy-dom has a native impl)
  resetClipboardMock();
});
