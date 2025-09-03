import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import TextCounter from "@/components/TextCounter";
import { mockTextData } from "../utils/mock-data";

describe("TextCounter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<TextCounter />);

    expect(screen.getByText("Text Counter")).toBeInTheDocument();
    expect(
      screen.getByText("Analyze and count text content")
    ).toBeInTheDocument();
  });

  it("counts characters correctly", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    fireEvent.change(textarea, { target: { value: mockTextData.sampleText } });

    await waitFor(() => {
      expect(screen.getByText("Characters:")).toBeInTheDocument();
      expect(screen.getByText("Words:")).toBeInTheDocument();
      expect(screen.getByText("Lines:")).toBeInTheDocument();
    });
  });

  it("counts words correctly", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    fireEvent.change(textarea, { target: { value: "Hello world test" } });

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument(); // 3 words
    });
  });

  it("counts lines correctly", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    fireEvent.change(textarea, { target: { value: "Line 1\nLine 2\nLine 3" } });

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument(); // 3 lines
    });
  });

  it("calculates reading time correctly", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    fireEvent.change(textarea, { target: { value: mockTextData.longText } });

    await waitFor(() => {
      expect(screen.getByText(/reading time/i)).toBeInTheDocument();
    });
  });

  it("handles empty text", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    fireEvent.change(textarea, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument(); // All counts should be 0
    });
  });

  it("clears text when clear button is clicked", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    const clearButton = screen.getByText("Clear");

    fireEvent.change(textarea, { target: { value: mockTextData.sampleText } });
    fireEvent.click(clearButton);

    expect(textarea).toHaveValue("");
  });

  it("copies text to clipboard", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    const copyButton = screen.getByText("Copy Text");

    fireEvent.change(textarea, { target: { value: mockTextData.sampleText } });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockTextData.sampleText
    );
  });

  it("handles file upload", async () => {
    render(<TextCounter />);

    const file = new File([mockTextData.sampleText], "test.txt", {
      type: "text/plain",
    });
    const fileInput = screen.getByLabelText(/upload file/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(
        "Enter or paste your text here..."
      );
      expect(textarea).toHaveValue(mockTextData.sampleText);
    });
  });

  it("shows character frequency analysis", async () => {
    render(<TextCounter />);

    const textarea = screen.getByPlaceholderText(
      "Enter or paste your text here..."
    );
    fireEvent.change(textarea, { target: { value: "hello world" } });

    await waitFor(() => {
      expect(screen.getByText(/character frequency/i)).toBeInTheDocument();
    });
  });
});
