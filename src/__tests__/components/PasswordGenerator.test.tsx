import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import PasswordGenerator from "@/components/PasswordGenerator";
import { mockPasswordData } from "../utils/mock-data";

describe("PasswordGenerator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<PasswordGenerator />);

    expect(screen.getByText("Password Generator")).toBeInTheDocument();
    expect(screen.getByText("Generate secure passwords")).toBeInTheDocument();
  });

  it("generates a password with default settings", async () => {
    render(<PasswordGenerator />);

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue(/./);
      expect(passwordInput).toBeInTheDocument();
    });
  });

  it("adjusts password length with slider", async () => {
    render(<PasswordGenerator />);

    const lengthSlider = screen.getByRole("slider", { name: /length/i });
    fireEvent.change(lengthSlider, { target: { value: "20" } });

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue(/./);
      expect(passwordInput.value).toHaveLength(20);
    });
  });

  it("toggles character type options", async () => {
    render(<PasswordGenerator />);

    const uppercaseCheckbox = screen.getByLabelText(/uppercase/i);
    const lowercaseCheckbox = screen.getByLabelText(/lowercase/i);
    const numbersCheckbox = screen.getByLabelText(/numbers/i);
    const symbolsCheckbox = screen.getByLabelText(/symbols/i);

    // Test toggling options
    fireEvent.click(uppercaseCheckbox);
    expect(uppercaseCheckbox).not.toBeChecked();

    fireEvent.click(lowercaseCheckbox);
    expect(lowercaseCheckbox).not.toBeChecked();

    fireEvent.click(numbersCheckbox);
    expect(numbersCheckbox).not.toBeChecked();

    fireEvent.click(symbolsCheckbox);
    expect(symbolsCheckbox).not.toBeChecked();
  });

  it("prevents generation when no character types are selected", async () => {
    render(<PasswordGenerator />);

    // Uncheck all character type options
    const uppercaseCheckbox = screen.getByLabelText(/uppercase/i);
    const lowercaseCheckbox = screen.getByLabelText(/lowercase/i);
    const numbersCheckbox = screen.getByLabelText(/numbers/i);
    const symbolsCheckbox = screen.getByLabelText(/symbols/i);

    fireEvent.click(uppercaseCheckbox);
    fireEvent.click(lowercaseCheckbox);
    fireEvent.click(numbersCheckbox);
    fireEvent.click(symbolsCheckbox);

    const generateButton = screen.getByText("Generate Password");
    expect(generateButton).toBeDisabled();
  });

  it("copies generated password to clipboard", async () => {
    render(<PasswordGenerator />);

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      const copyButton = screen.getByText("Copy");
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it("shows password strength indicator", async () => {
    render(<PasswordGenerator />);

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/strength/i)).toBeInTheDocument();
    });
  });

  it("generates multiple passwords", async () => {
    render(<PasswordGenerator />);

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      const generateMoreButton = screen.getByText("Generate More");
      fireEvent.click(generateMoreButton);
    });

    await waitFor(() => {
      const passwordInputs = screen.getAllByDisplayValue(/./);
      expect(passwordInputs.length).toBeGreaterThan(1);
    });
  });

  it("excludes similar characters when option is enabled", async () => {
    render(<PasswordGenerator />);

    const excludeSimilarCheckbox = screen.getByLabelText(/exclude similar/i);
    fireEvent.click(excludeSimilarCheckbox);

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue(/./);
      const password = passwordInput.value;
      // Should not contain similar characters like 0, O, l, I
      expect(password).not.toMatch(/[0OlI]/);
    });
  });

  it("excludes ambiguous characters when option is enabled", async () => {
    render(<PasswordGenerator />);

    const excludeAmbiguousCheckbox =
      screen.getByLabelText(/exclude ambiguous/i);
    fireEvent.click(excludeAmbiguousCheckbox);

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue(/./);
      const password = passwordInput.value;
      // Should not contain ambiguous characters
      expect(password).not.toMatch(/[{}[\]()\/\\~,;.<>]/);
    });
  });

  it("includes custom characters when specified", async () => {
    render(<PasswordGenerator />);

    const customCharsInput = screen.getByPlaceholderText(/custom characters/i);
    fireEvent.change(customCharsInput, { target: { value: "!@#$%" } });

    const generateButton = screen.getByText("Generate Password");
    fireEvent.click(generateButton);

    await waitFor(() => {
      const passwordInput = screen.getByDisplayValue(/./);
      const password = passwordInput.value;
      // Should contain at least one of the custom characters
      expect(password).toMatch(/[!@#$%]/);
    });
  });
});
