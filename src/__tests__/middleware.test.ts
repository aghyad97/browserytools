import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

describe("middleware", () => {
  it("redirects the default-locale prefix", () => {
    const res = middleware(new NextRequest("https://browserytools.com/en/tools/depth-map"));
    expect(res.status).toBe(308);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/tools/depth-map");
  });
});
