"use client";

import {
  type UIEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type ChatScrollOptions = {
  active?: boolean;
  paused?: boolean;
  itemCount: number;
  layoutKey?: string | number;
  onReachEnd?: () => void;
};

export function useChatScroll({
  active = true,
  paused = false,
  itemCount,
  layoutKey,
  onReachEnd,
}: ChatScrollOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Follow content changes before scroll events can misinterpret the new height.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!active || paused || !viewport) return;
    // Follow before a scroll event can interpret newly added height as scrolling away.
    if (atBottomRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
      setShowJump(false);
    } else {
      setShowJump(
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight > 64,
      );
    }
  }, [active, paused, itemCount, layoutKey]);

  useEffect(() => {
    if (!active || paused) return;
    let observer: ResizeObserver | undefined;
    const frame = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      observer = new ResizeObserver(() => {
        if (atBottomRef.current) viewport.scrollTop = viewport.scrollHeight;
      });
      observer.observe(viewport);
      if (viewport.firstElementChild)
        observer.observe(viewport.firstElementChild);
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [active, paused]);

  const updatePosition = (): void => {
    const viewport = viewportRef.current;
    atBottomRef.current = Boolean(
      viewport &&
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 64,
    );
  };

  const onScroll = (_event: UIEvent<HTMLDivElement>): void => {
    if (paused) return;
    updatePosition();
    setShowJump(!atBottomRef.current);
    if (atBottomRef.current) onReachEnd?.();
  };

  const resetScroll = (atBottom = true): void => {
    atBottomRef.current = atBottom;
    setShowJump(!atBottom);
    requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (viewport) viewport.scrollTop = atBottom ? viewport.scrollHeight : 0;
    });
  };

  const scrollToLatest = (): void => {
    atBottomRef.current = true;
    const viewport = viewportRef.current;
    viewport?.scrollTo({
      top: viewport.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return {
    viewportRef,
    atBottomRef,
    showJump,
    onScroll,
    resetScroll,
    updatePosition,
    scrollToLatest,
  };
}

export type ChatScrollController = ReturnType<typeof useChatScroll>;
