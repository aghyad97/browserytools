import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  createEvent,
  waitFor,
} from "@testing-library/react";
import { FileDropzone } from "@/components/shared/FileDropzone";

describe("FileDropzone", () => {
  it("renders title and subtitle", () => {
    render(<FileDropzone onFiles={() => {}} title="Drop an image" subtitle="stays on your device" />);
    expect(screen.getByText("Drop an image")).toBeInTheDocument();
    expect(screen.getByText("stays on your device")).toBeInTheDocument();
  });

  it("calls onFiles with dropped files", async () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} />);
    const file = new File(["x"], "a.png", { type: "image/png" });
    const zone = screen.getByTestId("file-dropzone");
    // happy-dom ignores a `dataTransfer` init object passed to fireEvent.drop and
    // substitutes an empty DataTransfer, so attach the payload explicitly.
    const dropEvent = createEvent.drop(zone);
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: { files: [file], types: ["Files"] },
    });
    fireEvent(zone, dropEvent);
    await waitFor(() => expect(onFiles).toHaveBeenCalledWith([file]));
  });

  it("renders children instead of the default title/subtitle content", () => {
    render(
      <FileDropzone onFiles={() => {}} title="Should not appear" subtitle="Nor this">
        <span data-testid="custom-child">Custom content</span>
      </FileDropzone>
    );
    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    expect(screen.queryByText("Should not appear")).not.toBeInTheDocument();
    expect(screen.queryByText("Nor this")).not.toBeInTheDocument();
  });

  it("uses a function className verbatim as the root class (full control)", () => {
    render(
      <FileDropzone
        onFiles={() => {}}
        className={({ isDragActive }) =>
          `custom-zone ${isDragActive ? "dragging" : "idle"}`
        }
      />
    );
    const zone = screen.getByTestId("file-dropzone");
    expect(zone.className).toBe("custom-zone idle");
  });

  it("merges a string className onto the default classes", () => {
    render(<FileDropzone onFiles={() => {}} className="h-64" />);
    const zone = screen.getByTestId("file-dropzone");
    expect(zone.className).toContain("h-64");
    expect(zone.className).toContain("border-dashed");
  });

  it("spreads inputProps onto the hidden file input", () => {
    render(
      <FileDropzone onFiles={() => {}} inputProps={{ "data-testid": "audio-input" }} />
    );
    const input = screen.getByTestId("audio-input") as HTMLInputElement;
    expect(input.type).toBe("file");
  });
});
