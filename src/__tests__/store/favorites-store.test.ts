import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavoritesStore } from "@/store/favorites-store";
import type { Tool } from "@/lib/tools-config";

const initialState = { favorites: [] };

beforeEach(() => {
  useFavoritesStore.setState(initialState);
});

const mockTools: (Tool & { category: string })[] = [
  {
    name: "Password Generator",
    href: "/tools/password-generator",
    description: "Generate secure passwords",
    category: "Security",
    icon: () => null,
    order: 1,
    available: true,
    creationDate: "2024-01-01",
  },
  {
    name: "Base64",
    href: "/tools/base64",
    description: "Encode and decode Base64",
    category: "Encoding",
    icon: () => null,
    order: 2,
    available: true,
    creationDate: "2024-01-01",
  },
];

describe("useFavoritesStore — addFavorite / removeFavorite", () => {
  it("adds a tool href to favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => { result.current.addFavorite("/tools/password-generator"); });
    expect(result.current.favorites).toContain("/tools/password-generator");
  });

  it("removes a tool href from favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => { result.current.addFavorite("/tools/base64"); });
    act(() => { result.current.removeFavorite("/tools/base64"); });
    expect(result.current.favorites).not.toContain("/tools/base64");
  });
});

describe("useFavoritesStore — toggleFavorite", () => {
  it("adds when not yet favorited", () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => { result.current.toggleFavorite("/tools/password-generator"); });
    expect(result.current.favorites).toContain("/tools/password-generator");
  });

  it("removes when already favorited", () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => { result.current.addFavorite("/tools/base64"); });
    act(() => { result.current.toggleFavorite("/tools/base64"); });
    expect(result.current.favorites).not.toContain("/tools/base64");
  });
});

describe("useFavoritesStore — isFavorite", () => {
  it("returns true for a favorited tool", () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => { result.current.addFavorite("/tools/password-generator"); });
    expect(result.current.isFavorite("/tools/password-generator")).toBe(true);
  });

  it("returns false for a non-favorited tool", () => {
    const { result } = renderHook(() => useFavoritesStore());
    expect(result.current.isFavorite("/tools/base64")).toBe(false);
  });
});

describe("useFavoritesStore — getFavoriteTools", () => {
  it("returns tools that are favorited", () => {
    const { result } = renderHook(() => useFavoritesStore());
    act(() => { result.current.addFavorite("/tools/base64"); });
    const favTools = result.current.getFavoriteTools(mockTools);
    expect(favTools).toHaveLength(1);
    expect(favTools[0].name).toBe("Base64");
  });

  it("returns empty array when no favorites are set", () => {
    const { result } = renderHook(() => useFavoritesStore());
    const favTools = result.current.getFavoriteTools(mockTools);
    expect(favTools).toHaveLength(0);
  });
});
