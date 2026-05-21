import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CurlConverter from "@/components/CurlConverter";

const SAMPLE_CURL = `curl -X POST https://api.example.com/v1/users?team=core -H "Content-Type: application/json" -H "Authorization: Bearer token123" -d '{"name":"Ada","role":"admin"}'`;

function getInput() {
  return screen.getAllByRole("textbox")[0];
}
function getOutput() {
  return screen.getAllByRole("textbox")[1] as HTMLTextAreaElement;
}

describe("CurlConverter", () => {
  it("renders input and output textareas", () => {
    render(<CurlConverter />);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThanOrEqual(2);
  });

  it("parses a curl command into JS fetch with correct method, url, headers and body", async () => {
    const user = userEvent.setup();
    render(<CurlConverter />);

    // userEvent.type interprets braces/brackets specially; paste raw text instead
    const input = getInput();
    input.focus();
    await user.paste(SAMPLE_CURL);

    const out = getOutput().value;
    // method
    expect(out).toContain('method: "POST"');
    // url with query preserved
    expect(out).toContain("https://api.example.com/v1/users?team=core");
    // headers
    expect(out).toContain('"Content-Type": "application/json"');
    expect(out).toContain('"Authorization": "Bearer token123"');
    // body serialized as JSON
    expect(out).toContain("JSON.stringify");
    expect(out).toContain('"name": "Ada"');
    expect(out).toContain('"role": "admin"');
    // it is a fetch call
    expect(out).toContain("await fetch(");
  });

  it("switches target language to Python requests", async () => {
    const user = userEvent.setup();
    render(<CurlConverter />);

    const input = getInput();
    input.focus();
    await user.paste(SAMPLE_CURL);

    // open the language select and choose Python
    const select = screen.getByRole("combobox");
    await user.click(select);
    const pythonOption = await screen.findByRole("option", {
      name: /python/i,
    });
    await user.click(pythonOption);

    const out = getOutput().value;
    expect(out).toContain("import requests");
    expect(out).toContain("requests.post(");
    expect(out).toContain('"Authorization": "Bearer token123"');
  });

  it("defaults to GET when no method or body is given", async () => {
    const user = userEvent.setup();
    render(<CurlConverter />);

    const input = getInput();
    input.focus();
    await user.paste("curl https://example.com/api");

    const out = getOutput().value;
    expect(out).toContain('method: "GET"');
    expect(out).toContain("https://example.com/api");
  });

  it("copies the generated output to the clipboard", async () => {
    const user = userEvent.setup();
    render(<CurlConverter />);

    const input = getInput();
    input.focus();
    await user.paste("curl https://example.com/api");

    const writeSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const copyBtn = screen.getByRole("button", { name: /copy/i });
    await user.click(copyBtn);

    expect(writeSpy).toHaveBeenCalled();
    expect(writeSpy.mock.calls[0][0]).toContain("await fetch(");
  });
});
