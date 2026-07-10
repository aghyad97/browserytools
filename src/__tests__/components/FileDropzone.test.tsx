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
});
