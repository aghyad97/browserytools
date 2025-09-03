import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import { mockQRCodeData } from "../utils/mock-data";

describe("QRCodeGenerator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<QRCodeGenerator />);

    expect(screen.getByText("QR Code Generator")).toBeInTheDocument();
    expect(
      screen.getByText("Generate QR codes from text, URLs, and more")
    ).toBeInTheDocument();
  });

  it("generates QR code for text input", async () => {
    render(<QRCodeGenerator />);

    const textInput = screen.getByPlaceholderText(
      "Enter text, URL, or data..."
    );
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(textInput, { target: { value: mockQRCodeData.text } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
    });
  });

  it("generates QR code for URL", async () => {
    render(<QRCodeGenerator />);

    const textInput = screen.getByPlaceholderText(
      "Enter text, URL, or data..."
    );
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(textInput, { target: { value: mockQRCodeData.url } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
    });
  });

  it("generates QR code for email", async () => {
    render(<QRCodeGenerator />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(emailInput, { target: { value: mockQRCodeData.email } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
    });
  });

  it("generates QR code for phone number", async () => {
    render(<QRCodeGenerator />);

    const phoneInput = screen.getByPlaceholderText(/phone number/i);
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(phoneInput, { target: { value: mockQRCodeData.phone } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
    });
  });

  it("generates QR code for WiFi credentials", async () => {
    render(<QRCodeGenerator />);

    const ssidInput = screen.getByPlaceholderText(/network name/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(ssidInput, {
      target: { value: mockQRCodeData.wifi.ssid },
    });
    fireEvent.change(passwordInput, {
      target: { value: mockQRCodeData.wifi.password },
    });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
    });
  });

  it("adjusts QR code size", async () => {
    render(<QRCodeGenerator />);

    const textInput = screen.getByPlaceholderText(
      "Enter text, URL, or data..."
    );
    const sizeSlider = screen.getByRole("slider", { name: /size/i });
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(textInput, { target: { value: mockQRCodeData.text } });
    fireEvent.change(sizeSlider, { target: { value: "300" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      const qrCode = screen.getByAltText(/qr code/i);
      expect(qrCode).toHaveAttribute("width", "300");
    });
  });

  it("changes QR code colors", async () => {
    render(<QRCodeGenerator />);

    const textInput = screen.getByPlaceholderText(
      "Enter text, URL, or data..."
    );
    const foregroundColorInput = screen.getByLabelText(/foreground color/i);
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(textInput, { target: { value: mockQRCodeData.text } });
    fireEvent.change(foregroundColorInput, { target: { value: "#ff0000" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
    });
  });

  it("downloads QR code as PNG", async () => {
    render(<QRCodeGenerator />);

    const textInput = screen.getByPlaceholderText(
      "Enter text, URL, or data..."
    );
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(textInput, { target: { value: mockQRCodeData.text } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      const downloadButton = screen.getByText("Download PNG");
      fireEvent.click(downloadButton);
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("downloads QR code as SVG", async () => {
    render(<QRCodeGenerator />);

    const textInput = screen.getByPlaceholderText(
      "Enter text, URL, or data..."
    );
    const generateButton = screen.getByText("Generate QR Code");

    fireEvent.change(textInput, { target: { value: mockQRCodeData.text } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      const downloadButton = screen.getByText("Download SVG");
      fireEvent.click(downloadButton);
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("shows error for empty input", async () => {
    render(<QRCodeGenerator />);

    const generateButton = screen.getByText("Generate QR Code");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter some text/i)).toBeInTheDocument();
    });
  });

  it("clears all inputs", async () => {
    render(<QRCodeGenerator />);

    const textInput = screen.getByPlaceholderText(
      "Enter text, URL, or data..."
    );
    const clearButton = screen.getByText("Clear All");

    fireEvent.change(textInput, { target: { value: mockQRCodeData.text } });
    fireEvent.click(clearButton);

    expect(textInput).toHaveValue("");
  });

  it("switches between different QR code types", async () => {
    render(<QRCodeGenerator />);

    const textTab = screen.getByText("Text");
    const urlTab = screen.getByText("URL");
    const emailTab = screen.getByText("Email");
    const phoneTab = screen.getByText("Phone");
    const wifiTab = screen.getByText("WiFi");

    fireEvent.click(urlTab);
    expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();

    fireEvent.click(emailTab);
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();

    fireEvent.click(phoneTab);
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();

    fireEvent.click(wifiTab);
    expect(screen.getByPlaceholderText(/network name/i)).toBeInTheDocument();

    fireEvent.click(textTab);
    expect(
      screen.getByPlaceholderText("Enter text, URL, or data...")
    ).toBeInTheDocument();
  });
});
