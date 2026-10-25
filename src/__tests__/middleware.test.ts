import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const run = (path: string, init?: ConstructorParameters<typeof NextRequest>[1]) =>
  middleware(new NextRequest(`https://browserytools.com${path}`, init));

describe("middleware x-pathname", () => {
  it("forwards a tool path", () => {
    const res = run("/tools/depth-map");
    expect(res.headers.get("x-middleware-request-x-pathname")).toBe("/tools/depth-map");
    expect(res.headers.get("x-middleware-request-x-browsery-locale")).toBeTruthy();
  });

  it("forwards the locale-prefixed public pathname", () => {
    const res = run("/ru/tools/compress-image-to-1mb");
    expect(res.headers.get("x-middleware-request-x-pathname")).toBe(
      "/ru/tools/compress-image-to-1mb",
    );
  });

  it("forwards a non-tool path", () => {
    const res = run("/blog");
    expect(res.headers.get("x-middleware-request-x-pathname")).toBe("/blog");
  });

  it("still redirects the default-locale prefix", () => {
    const res = run("/en/tools/depth-map");
    expect(res.status).toBe(308);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/tools/depth-map");
  });
});
