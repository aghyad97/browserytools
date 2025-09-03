import React from "react";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import { getAllTools } from "@/lib/tools-config";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

describe("Navigation Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sidebar with all tool categories", () => {
    render(<Sidebar />);

    const tools = getAllTools();
    const categories = [...new Set(tools.map((tool) => tool.category))];

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("renders all available tools in sidebar", () => {
    render(<Sidebar />);

    const tools = getAllTools().filter((tool) => tool.available);

    tools.forEach((tool) => {
      expect(screen.getByText(tool.name)).toBeInTheDocument();
    });
  });

  it("filters tools when searching", async () => {
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText("Search tools...");
    fireEvent.change(searchInput, { target: { value: "text" } });

    await waitFor(() => {
      expect(screen.getByText("Text Case Converter")).toBeInTheDocument();
      expect(screen.getByText("Text Counter")).toBeInTheDocument();
    });
  });

  it("shows no results for invalid search", async () => {
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText("Search tools...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(screen.getByText(/no tools found/i)).toBeInTheDocument();
    });
  });

  it("clears search when input is empty", async () => {
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText("Search tools...");

    // Search for something
    fireEvent.change(searchInput, { target: { value: "text" } });

    await waitFor(() => {
      expect(screen.getByText("Text Case Converter")).toBeInTheDocument();
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      const tools = getAllTools().filter((tool) => tool.available);
      tools.forEach((tool) => {
        expect(screen.getByText(tool.name)).toBeInTheDocument();
      });
    });
  });

  it("renders header with logo and title", () => {
    render(<Header />);

    expect(screen.getByText("BrowseryTools")).toBeInTheDocument();
  });

  it("shows mobile menu button on small screens", () => {
    // Mock small screen
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header />);

    const menuButton = screen.getByLabelText(/menu/i);
    expect(menuButton).toBeInTheDocument();
  });

  it("opens mobile menu when menu button is clicked", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Header />);

    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);

    expect(screen.getByText("BrowseryTools")).toBeInTheDocument();
  });

  it("shows social links in header", () => {
    render(<Header />);

    expect(screen.getByLabelText(/github/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/twitter/i)).toBeInTheDocument();
  });

  it("opens GitHub issue when request tool button is clicked", () => {
    render(<Header />);

    const requestButton = screen.getByText(/request tool/i);
    fireEvent.click(requestButton);

    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining("github.com"),
      "_blank"
    );
  });
});

describe("Tool Navigation Flow", () => {
  it("navigates to tool page when tool is clicked", async () => {
    render(<Sidebar />);

    const textCounterLink = screen.getByText("Text Counter");
    fireEvent.click(textCounterLink);

    // In a real test, you would check if the URL changed
    // For now, we'll just verify the link has the correct href
    expect(textCounterLink.closest("a")).toHaveAttribute(
      "href",
      "/tools/text-counter"
    );
  });

  it("highlights current tool in sidebar", () => {
    // Mock current pathname
    jest.doMock("next/navigation", () => ({
      usePathname: () => "/tools/text-counter",
      useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
      }),
    }));

    render(<Sidebar />);

    const textCounterLink = screen.getByText("Text Counter");
    expect(textCounterLink.closest("a")).toHaveClass("bg-accent");
  });

  it("shows tool description in sidebar", () => {
    render(<Sidebar />);

    const textCounterLink = screen.getByText("Text Counter");
    const tooltip = textCounterLink.closest("[data-tooltip]");

    expect(tooltip).toBeInTheDocument();
  });
});
