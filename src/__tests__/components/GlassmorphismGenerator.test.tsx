import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GlassmorphismGenerator from "@/components/GlassmorphismGenerator";

describe("GlassmorphismGenerator", () => {
  it("renders the live CSS output with backdrop-filter and -webkit- prefix", () => {
    render(<GlassmorphismGenerator />);
    const output = screen.getByTestId("css-output").textContent ?? "";
    expect(output).toContain("backdrop-filter:");
    expect(output).toContain("-webkit-backdrop-filter:");
    expect(output).toContain("@supports not");
  });

  it("updates the generated CSS blur value when the blur input changes", async () => {
    const user = userEvent.setup();
    render(<GlassmorphismGenerator />);

    const blur = screen.getByTestId("blur-input");
    await user.clear(blur);
    await user.type(blur, "30");

    const output = screen.getByTestId("css-output").textContent ?? "";
    expect(output).toContain("blur(30px)");
  });

  it("reflects the transparency/opacity input in the background rgba alpha", async () => {
    const user = userEvent.setup();
    render(<GlassmorphismGenerator />);

    const opacity = screen.getByTestId("opacity-input");
    await user.clear(opacity);
    await user.type(opacity, "50");

    const output = screen.getByTestId("css-output").textContent ?? "";
    // 50% -> 0.50 alpha on the white tint background
    expect(output).toContain("rgba(255, 255, 255, 0.50)");
  });

  it("copies the generated CSS to the clipboard", async () => {
    const user = userEvent.setup();
    render(<GlassmorphismGenerator />);

    const writeSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const copyBtn = screen.getByRole("button", { name: /copy css/i });
    await user.click(copyBtn);

    expect(writeSpy).toHaveBeenCalledTimes(1);
    const copied = writeSpy.mock.calls[0][0] as string;
    expect(copied).toContain("backdrop-filter:");
  });
});
