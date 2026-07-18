import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CueEditor } from "@/components/subtitle-studio/CueEditor";
import type { CueDoc } from "@/lib/subtitles/cues";

function twoCueDoc(): CueDoc {
  return [
    { id: "a", start: 0, end: 2, text: "hello there" },
    { id: "b", start: 2, end: 4, text: "general kenobi" },
  ];
}

function threeCueDoc(): CueDoc {
  return [
    { id: "a", start: 0, end: 2, text: "hello there" },
    { id: "b", start: 2, end: 4, text: "general kenobi" },
    { id: "c", start: 4, end: 6, text: "you are a bold one" },
  ];
}

describe("CueEditor", () => {
  it("renders one row per cue", () => {
    render(<CueEditor doc={twoCueDoc()} onChange={vi.fn()} onSeek={vi.fn()} />);
    expect(screen.getAllByTestId("cue-row")).toHaveLength(2);
  });

  it("commits a text edit on blur, calling onChange with the updated text", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={onChange} onSeek={vi.fn()} />);

    const textareas = screen.getAllByTestId("cue-text-input");
    await user.clear(textareas[0]);
    await user.type(textareas[0], "hi world");
    await user.tab();

    expect(onChange).toHaveBeenCalled();
    const updated = onChange.mock.calls.at(-1)![0] as CueDoc;
    expect(updated[0].text).toBe("hi world");
    expect(updated[1].text).toBe("general kenobi");
  });

  it("does not call onChange if the text is unchanged on blur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={onChange} onSeek={vi.fn()} />);

    const textareas = screen.getAllByTestId("cue-text-input");
    await user.click(textareas[0]);
    await user.tab();

    expect(onChange).not.toHaveBeenCalled();
  });

  it("commits a start-time edit on blur via retime", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={onChange} onSeek={vi.fn()} />);

    const starts = screen.getAllByTestId("cue-start-input");
    await user.clear(starts[1]);
    await user.type(starts[1], "2.5");
    await user.tab();

    expect(onChange).toHaveBeenCalled();
    const updated = onChange.mock.calls.at(-1)![0] as CueDoc;
    expect(updated[1].start).toBe(2.5);
  });

  it("reverts a blank start field on blur instead of committing 0", async () => {
    // Use the second cue (start=2, non-zero) so a wrongly-committed 0 is
    // distinguishable from the cue's actual start.
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={onChange} onSeek={vi.fn()} />);

    const starts = screen.getAllByTestId("cue-start-input");
    await user.clear(starts[1]);
    await user.tab();

    expect(onChange).not.toHaveBeenCalled();
    expect(starts[1]).toHaveValue(2);
  });

  it("reverts a blank end field on blur instead of committing 0", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={onChange} onSeek={vi.fn()} />);

    const ends = screen.getAllByTestId("cue-end-input");
    await user.clear(ends[0]);
    await user.tab();

    expect(onChange).not.toHaveBeenCalled();
    expect(ends[0]).toHaveValue(2);
  });

  it("splits a cue into two on 'split', going from 2 to 3 cues", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={onChange} onSeek={vi.fn()} />);

    const splitButtons = screen.getAllByTestId("cue-split");
    await user.click(splitButtons[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0][0] as CueDoc;
    expect(updated).toHaveLength(3);
    // the split cue's two halves together still span the original range
    expect(updated[0].start).toBe(0);
    expect(updated[1].end).toBe(2);
  });

  it("merges a cue with the next cue on 'merge with next', going from 2 to 1 cue", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={onChange} onSeek={vi.fn()} />);

    const mergeButtons = screen.getAllByTestId("cue-merge-next");
    // Only the non-last row offers "merge with next"
    expect(mergeButtons).toHaveLength(1);
    await user.click(mergeButtons[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0][0] as CueDoc;
    expect(updated).toHaveLength(1);
    expect(updated[0].text).toBe("hello there general kenobi");
    expect(updated[0].start).toBe(0);
    expect(updated[0].end).toBe(4);
  });

  it("does not offer 'merge with next' on the last cue", () => {
    // 3 cues → exactly n-1 (2) merge buttons: one per row except the last.
    render(<CueEditor doc={threeCueDoc()} onChange={vi.fn()} onSeek={vi.fn()} />);
    const rows = screen.getAllByTestId("cue-row");
    const mergeButtons = screen.getAllByTestId("cue-merge-next");
    expect(rows).toHaveLength(3);
    expect(mergeButtons).toHaveLength(2);
  });

  it("calls onSeek with the cue's start time when a row is clicked", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={vi.fn()} onSeek={onSeek} />);

    const rows = screen.getAllByTestId("cue-row");
    await user.click(rows[1]);

    expect(onSeek).toHaveBeenCalledWith(2);
  });

  it("calls onSeek via the dedicated seek button without triggering a double call", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();
    render(<CueEditor doc={twoCueDoc()} onChange={vi.fn()} onSeek={onSeek} />);

    const seekButtons = screen.getAllByTestId("cue-seek");
    await user.click(seekButtons[0]);

    expect(onSeek).toHaveBeenCalledTimes(1);
    expect(onSeek).toHaveBeenCalledWith(0);
  });

  it("renders an empty state with no cues", () => {
    render(<CueEditor doc={[]} onChange={vi.fn()} onSeek={vi.fn()} />);
    expect(screen.getByTestId("cue-editor-empty")).toBeInTheDocument();
    expect(screen.queryByTestId("cue-row")).not.toBeInTheDocument();
  });
});
