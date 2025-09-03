import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import PDFTools from "@/components/PDFTools";
import { createMockPDFFile, mockPDFData } from "../utils/mock-data";

describe("PDFTools", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<PDFTools />);

    expect(screen.getByText("PDF Tools")).toBeInTheDocument();
    expect(
      screen.getByText("Merge, split, compress, and manipulate PDF files")
    ).toBeInTheDocument();
  });

  it("uploads PDF files", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });
  });

  it("uploads multiple PDF files", async () => {
    render(<PDFTools />);

    const file1 = createMockPDFFile("test1.pdf");
    const file2 = createMockPDFFile("test2.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    await waitFor(() => {
      expect(screen.getByText("test1.pdf")).toBeInTheDocument();
      expect(screen.getByText("test2.pdf")).toBeInTheDocument();
    });
  });

  it("enables merge tool when multiple files are uploaded", async () => {
    render(<PDFTools />);

    const file1 = createMockPDFFile("test1.pdf");
    const file2 = createMockPDFFile("test2.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    await waitFor(() => {
      const mergeButton = screen.getByText("Merge PDFs");
      expect(mergeButton).not.toBeDisabled();
    });
  });

  it("disables merge tool when less than 2 files are uploaded", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const mergeButton = screen.getByText("Merge PDFs");
      expect(mergeButton).toBeDisabled();
    });
  });

  it("enables split tool when file is uploaded", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const splitButton = screen.getByText("Split PDF");
      expect(splitButton).not.toBeDisabled();
    });
  });

  it("enables compress tool when file is uploaded", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const compressButton = screen.getByText("Compress PDF");
      expect(compressButton).not.toBeDisabled();
    });
  });

  it("enables rotate tools when file is uploaded", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const rotateCwButton = screen.getByText("Rotate PDF");
      const rotateCcwButton = screen.getByText("Rotate PDF (CCW)");
      expect(rotateCwButton).not.toBeDisabled();
      expect(rotateCcwButton).not.toBeDisabled();
    });
  });

  it("shows file information after upload", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/file size/i)).toBeInTheDocument();
      expect(screen.getByText(/pages/i)).toBeInTheDocument();
    });
  });

  it("removes file when remove button is clicked", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const removeButton = screen.getByLabelText(/remove file/i);
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
    });
  });

  it("shows split dialog when split button is clicked", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const splitButton = screen.getByText("Split PDF");
      fireEvent.click(splitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/split pdf/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/page ranges/i)).toBeInTheDocument();
    });
  });

  it("validates page ranges in split dialog", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const splitButton = screen.getByText("Split PDF");
      fireEvent.click(splitButton);
    });

    await waitFor(() => {
      const pageRangeInput = screen.getByPlaceholderText(/page ranges/i);
      fireEvent.change(pageRangeInput, { target: { value: "1-3,5,7-10" } });

      const splitButton = screen.getByText("Split PDF");
      fireEvent.click(splitButton);
    });

    // Should handle the split operation
    expect(screen.getByText(/splitting/i)).toBeInTheDocument();
  });

  it("shows drag and drop area", () => {
    render(<PDFTools />);

    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
  });

  it("handles drag and drop events", async () => {
    render(<PDFTools />);

    const dropArea = screen.getByText(/drag and drop/i).closest("div");
    const file = createMockPDFFile("test.pdf");

    const dragOverEvent = new Event("dragover", { bubbles: true });
    const dropEvent = new Event("drop", { bubbles: true });

    Object.defineProperty(dropEvent, "dataTransfer", {
      value: {
        files: [file],
        items: [{ kind: "file", type: "application/pdf" }],
      },
    });

    fireEvent(dropArea!, dragOverEvent);
    fireEvent(dropArea!, dropEvent);

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });
  });

  it("shows progress during operations", async () => {
    render(<PDFTools />);

    const file = createMockPDFFile("test.pdf");
    const fileInput = screen.getByLabelText(/upload pdf files/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const compressButton = screen.getByText("Compress PDF");
      fireEvent.click(compressButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });
});
