import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock file creation utilities
export const createMockFile = (
  name: string,
  type: string,
  content: string = "mock file content"
): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

export const createMockImageFile = (
  name: string = "test-image.jpg",
  width: number = 100,
  height: number = 100
): File => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(0, 0, width, height);

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], name, { type: "image/jpeg" }));
      }
    }, "image/jpeg");
  }) as any;
};

export const createMockPDFFile = (name: string = "test.pdf"): File => {
  const pdfContent =
    "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF";
  return createMockFile(name, "application/pdf", pdfContent);
};

export const createMockAudioFile = (name: string = "test.mp3"): File => {
  return createMockFile(name, "audio/mpeg", "mock audio content");
};

export const createMockVideoFile = (name: string = "test.mp4"): File => {
  return createMockFile(name, "video/mp4", "mock video content");
};

export const createMockZipFile = (name: string = "test.zip"): File => {
  return createMockFile(name, "application/zip", "mock zip content");
};

export const createMockCSVFile = (name: string = "test.csv"): File => {
  const csvContent = "Name,Age,City\nJohn,25,New York\nJane,30,Los Angeles";
  return createMockFile(name, "text/csv", csvContent);
};

export const createMockJSONFile = (name: string = "test.json"): File => {
  const jsonContent = JSON.stringify({
    name: "John",
    age: 25,
    city: "New York",
  });
  return createMockFile(name, "application/json", jsonContent);
};

// Mock data utilities
export const mockImageData = {
  width: 100,
  height: 100,
  data: new Uint8ClampedArray(40000), // 100 * 100 * 4 (RGBA)
};

export const mockPDFData = {
  pageCount: 1,
  title: "Test PDF",
  author: "Test Author",
};

// Wait utilities
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock user interactions
export const mockUserUpload = async (file: File) => {
  const input = document.createElement("input");
  input.type = "file";
  input.files = [file] as any;

  const event = new Event("change", { bubbles: true });
  Object.defineProperty(event, "target", {
    writable: false,
    value: input,
  });

  return event;
};

// Mock clipboard operations
export const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
  readText: jest.fn().mockResolvedValue(""),
  write: jest.fn().mockResolvedValue(undefined),
  read: jest.fn().mockResolvedValue([]),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

// Mock download functionality
export const mockDownload = jest.fn();
global.URL.createObjectURL = jest.fn(() => "mock-object-url");
global.URL.revokeObjectURL = jest.fn();

// Mock window.open
global.open = jest.fn();

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
