import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import Base64Converter from "@/components/Base64Converter";
import { createMockFile, mockBase64Data } from "../utils/mock-data";

describe("Base64Converter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<Base64Converter />);

    expect(screen.getByText("Base64 Converter")).toBeInTheDocument();
    expect(
      screen.getByText("Encode or decode Base64 strings and files")
    ).toBeInTheDocument();
  });

  it("encodes text to Base64", async () => {
    render(<Base64Converter />);

    const textInput = screen.getByPlaceholderText("Enter text to encode...");
    const encodeButton = screen.getByText("Encode");

    fireEvent.change(textInput, { target: { value: mockBase64Data.text } });
    fireEvent.click(encodeButton);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockBase64Data.encoded)
      ).toBeInTheDocument();
    });
  });

  it("decodes Base64 to text", async () => {
    render(<Base64Converter />);

    const textInput = screen.getByPlaceholderText("Enter Base64 to decode...");
    const decodeButton = screen.getByText("Decode");

    fireEvent.change(textInput, { target: { value: mockBase64Data.encoded } });
    fireEvent.click(decodeButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockBase64Data.text)).toBeInTheDocument();
    });
  });

  it("handles file upload for encoding", async () => {
    render(<Base64Converter />);

    const file = createMockFile("test.txt", "text/plain", "Hello World");
    const fileInput = screen.getByLabelText(/upload file/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test.txt")).toBeInTheDocument();
    });
  });

  it("copies result to clipboard", async () => {
    render(<Base64Converter />);

    const textInput = screen.getByPlaceholderText("Enter text to encode...");
    const encodeButton = screen.getByText("Encode");

    fireEvent.change(textInput, { target: { value: mockBase64Data.text } });
    fireEvent.click(encodeButton);

    await waitFor(() => {
      const copyButton = screen.getByText("Copy");
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockBase64Data.encoded
    );
  });

  it("clears all inputs", async () => {
    render(<Base64Converter />);

    const textInput = screen.getByPlaceholderText("Enter text to encode...");
    const clearButton = screen.getByText("Clear All");

    fireEvent.change(textInput, { target: { value: mockBase64Data.text } });
    fireEvent.click(clearButton);

    expect(textInput).toHaveValue("");
  });

  it("handles invalid Base64 input gracefully", async () => {
    render(<Base64Converter />);

    const textInput = screen.getByPlaceholderText("Enter Base64 to decode...");
    const decodeButton = screen.getByText("Decode");

    fireEvent.change(textInput, { target: { value: "invalid-base64!" } });
    fireEvent.click(decodeButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid base64/i)).toBeInTheDocument();
    });
  });
});
