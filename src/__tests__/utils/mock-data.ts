// Mock data for testing various tools

export const mockTextData = {
  sampleText:
    "This is a sample text for testing purposes. It contains multiple sentences and words.",
  longText:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  codeSample: `function hello() {
  console.log("Hello, World!");
  return "success";
}`,
  jsonSample: {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    address: {
      street: "123 Main St",
      city: "New York",
      zipCode: "10001",
    },
    hobbies: ["reading", "coding", "gaming"],
  },
  csvSample: `Name,Age,Email,City
John Doe,30,john@example.com,New York
Jane Smith,25,jane@example.com,Los Angeles
Bob Johnson,35,bob@example.com,Chicago`,
};

export const mockImageData = {
  smallImage: {
    width: 100,
    height: 100,
    size: 1024, // 1KB
    type: "image/jpeg",
  },
  largeImage: {
    width: 1920,
    height: 1080,
    size: 2048000, // 2MB
    type: "image/png",
  },
  formats: ["jpg", "png", "webp", "gif", "bmp", "tiff", "svg"],
};

export const mockPDFData = {
  singlePage: {
    pageCount: 1,
    size: 50000, // 50KB
    title: "Test Document",
  },
  multiPage: {
    pageCount: 5,
    size: 200000, // 200KB
    title: "Multi-page Document",
  },
};

export const mockAudioData = {
  formats: ["mp3", "wav", "flac", "aac", "ogg"],
  sampleAudio: {
    duration: 30, // 30 seconds
    size: 500000, // 500KB
    type: "audio/mpeg",
  },
};

export const mockVideoData = {
  formats: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
  sampleVideo: {
    duration: 60, // 1 minute
    size: 5000000, // 5MB
    type: "video/mp4",
    width: 1280,
    height: 720,
  },
};

export const mockArchiveData = {
  zipFile: {
    size: 100000, // 100KB
    fileCount: 5,
    type: "application/zip",
  },
  files: [
    { name: "document.pdf", size: 50000, type: "application/pdf" },
    { name: "image.jpg", size: 30000, type: "image/jpeg" },
    { name: "text.txt", size: 1000, type: "text/plain" },
    { name: "data.json", size: 2000, type: "application/json" },
    {
      name: "spreadsheet.xlsx",
      size: 15000,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  ],
};

export const mockQRCodeData = {
  text: "https://example.com",
  url: "https://example.com",
  email: "test@example.com",
  phone: "+1234567890",
  wifi: {
    ssid: "TestNetwork",
    password: "testpassword",
    security: "WPA",
  },
};

export const mockColorData = {
  hex: "#ff0000",
  rgb: { r: 255, g: 0, b: 0 },
  hsl: { h: 0, s: 100, l: 50 },
  cmyk: { c: 0, m: 100, y: 100, k: 0 },
};

export const mockUnitData = {
  length: {
    meters: 1,
    feet: 3.28084,
    inches: 39.3701,
    centimeters: 100,
    kilometers: 0.001,
  },
  weight: {
    kilograms: 1,
    pounds: 2.20462,
    ounces: 35.274,
    grams: 1000,
    tons: 0.001,
  },
  temperature: {
    celsius: 0,
    fahrenheit: 32,
    kelvin: 273.15,
  },
};

export const mockInvoiceData = {
  company: {
    name: "Test Company",
    address: "123 Test St, Test City, TC 12345",
    email: "billing@testcompany.com",
    phone: "+1-555-0123",
  },
  client: {
    name: "Client Company",
    address: "456 Client Ave, Client City, CC 67890",
    email: "billing@clientcompany.com",
  },
  items: [
    {
      description: "Web Development",
      quantity: 40,
      rate: 75,
      amount: 3000,
    },
    {
      description: "Design Services",
      quantity: 20,
      rate: 50,
      amount: 1000,
    },
  ],
  totals: {
    subtotal: 4000,
    tax: 320,
    total: 4320,
  },
};

export const mockPasswordData = {
  requirements: {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
  },
  samplePasswords: ["MyStr0ng!Pass", "Secure#123Pass", "Complex$456Word"],
};

export const mockBase64Data = {
  text: "Hello, World!",
  encoded: "SGVsbG8sIFdvcmxkIQ==",
  image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  binary: "01001000 01100101 01101100 01101100 01101111",
};
