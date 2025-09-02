"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

interface ProximityPrefetchProps {
  children: ReactNode;
  threshold?: number;
  predictionInterval?: number;
}

export function ProximityPrefetch({
  children,
  threshold = 200,
  predictionInterval = 0,
}: ProximityPrefetchProps) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefetchedRoutes, setPrefetchedRoutes] = useState<Set<string>>(
    new Set()
  );
  const [links, setLinks] = useState<
    { el: HTMLAnchorElement; href: string; rect: DOMRect }[]
  >([]);

  const updateLinks = useCallback(() => {
    const anchors = Array.from(
      document.querySelectorAll('a[href^="/"]')
    ) as HTMLAnchorElement[];
    setLinks(
      anchors
        .map((el) => {
          const href = el.getAttribute("href");
          if (href?.startsWith("/") && !href.includes("#")) {
            return {
              el,
              href,
              rect: el.getBoundingClientRect(),
            };
          }
          return null;
        })
        .filter(Boolean) as {
        el: HTMLAnchorElement;
        href: string;
        rect: DOMRect;
      }[]
    );
  }, []);

  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const calculateCenterPoint = (rect: DOMRect) => {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const prefetchNearbyRoutes = useCallback(async () => {
    if (!links.length) return;

    // Sort links by proximity to current mouse position
    const linksWithDistance = links.map((link) => {
      const center = calculateCenterPoint(link.rect);
      const distance = calculateDistance(
        mousePosition.x,
        mousePosition.y,
        center.x,
        center.y
      );
      return { ...link, distance };
    });

    // Sort by distance
    linksWithDistance.sort((a, b) => a.distance - b.distance);

    // Prefetch the closest links that are within threshold
    const closestLinks = linksWithDistance.filter(
      (link) => link.distance < threshold
    );

    const routesToPrefetch = closestLinks.map((link) => link.href);

    // Prefetch up to 3 routes at a time
    for (const route of routesToPrefetch.slice(0, 3)) {
      if (!prefetchedRoutes.has(route)) {
        console.log("prefetching", route);
        router.prefetch(route);
        setPrefetchedRoutes((prev) => new Set([...prev, route]));
      }
    }
  }, [links, mousePosition, prefetchedRoutes, router, threshold]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Update links on mount and when DOM changes
    updateLinks();

    // Set up a MutationObserver to detect new links
    const observer = new MutationObserver(() => {
      updateLinks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });

    return () => {
      observer.disconnect();
    };
  }, [updateLinks]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (mousePosition.x !== 0 || mousePosition.y !== 0) {
        prefetchNearbyRoutes();
      }
    }, predictionInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [mousePosition, prefetchNearbyRoutes, predictionInterval]);

  return children;
}
