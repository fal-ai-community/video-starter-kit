"use client";

import clsx from "clsx";
import {
  type HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TimelineRulerProps = {
  duration?: number;
  zoom?: number;
  timelineWidth?: number;
} & HTMLAttributes<HTMLDivElement>;

type ViewportState = {
  width: number;
  contentWidth: number;
  scrollLeft: number;
  zoomAttr: number;
};

const MAJOR_INTERVALS: number[] = [
  0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1200, 1800, 3600,
  7200, 10800, 14400, 21600, 43200, 86400,
];

const RULER_HEIGHT = 48;
const MIN_MAJOR_SPACING_PX = 96;
const EPSILON = 0.000_01;

function formatTickLabel(seconds: number, majorInterval: number) {
  if (seconds < EPSILON) {
    return "0s";
  }

  if (seconds >= 3600) {
    const hours = seconds / 3600;
    const decimals = majorInterval < 3600 ? 1 : 0;
    return `${hours.toFixed(decimals)}h`;
  }

  if (seconds >= 60) {
    const minutes = seconds / 60;
    const decimals = majorInterval < 60 ? 1 : 0;
    return `${minutes.toFixed(decimals)}m`;
  }

  if (seconds >= 1) {
    const isNearInteger = Math.abs(seconds - Math.round(seconds)) < 0.005;
    const decimals =
      isNearInteger && majorInterval >= 1
        ? 0
        : majorInterval < 1
          ? Math.ceil(-Math.log10(majorInterval))
          : Math.min(
              2,
              Math.max(
                1,
                Math.ceil(-Math.log10(seconds - Math.floor(seconds))),
              ),
            );
    return `${seconds.toFixed(decimals)}s`;
  }

  return `${Math.round(seconds * 1000)}ms`;
}

function chooseMajorInterval(pixelsPerSecond: number) {
  const desiredSpacingSeconds = MAJOR_INTERVALS.find(
    (interval) => interval * pixelsPerSecond >= MIN_MAJOR_SPACING_PX,
  );

  return desiredSpacingSeconds ?? MAJOR_INTERVALS[MAJOR_INTERVALS.length - 1];
}

function chooseMinorInterval(majorInterval: number) {
  const smallerIntervals = MAJOR_INTERVALS.filter(
    (value) => value < majorInterval,
  );

  const matchingInterval = smallerIntervals
    .reverse()
    .find(
      (interval) =>
        Math.abs(
          majorInterval / interval - Math.round(majorInterval / interval),
        ) < EPSILON,
    );

  if (matchingInterval) {
    return matchingInterval;
  }

  const fallback = majorInterval / 2;
  return fallback > EPSILON ? fallback : majorInterval;
}

function clampToRange(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function TimelineRuler({
  className,
  duration = 30,
  zoom: zoomProp,
  timelineWidth,
  ...props
}: TimelineRulerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    width: 0,
    contentWidth: 0,
    scrollLeft: 0,
    zoomAttr: zoomProp ?? 1,
  });

  useEffect(() => {
    setViewport((previous) =>
      Math.abs(previous.zoomAttr - (zoomProp ?? previous.zoomAttr)) < EPSILON
        ? previous
        : { ...previous, zoomAttr: zoomProp ?? previous.zoomAttr },
    );
  }, [zoomProp]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const trackElement = element.nextElementSibling as HTMLElement | null;
    const scrollContainer =
      trackElement?.parentElement ?? element.parentElement ?? element;

    const resolveZoomFromDom = () => {
      const zoomSource =
        scrollContainer?.closest<HTMLElement>("[data-timeline-zoom]") ??
        scrollContainer;
      const attrValue = zoomSource?.getAttribute("data-timeline-zoom");
      if (attrValue) {
        const parsed = Number.parseFloat(attrValue);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }

      if (zoomSource) {
        const zoomVar =
          getComputedStyle(zoomSource).getPropertyValue("--timeline-zoom");
        const parsed = Number.parseFloat(zoomVar);
        if (Number.isFinite(parsed) && parsed > 0) {
          return parsed;
        }
      }

      return 1;
    };

    const readState = () => {
      const zoomValue = zoomProp ?? resolveZoomFromDom();

      const newState: ViewportState = {
        width: scrollContainer?.clientWidth ?? element.clientWidth,
        contentWidth:
          trackElement?.scrollWidth ??
          element.scrollWidth ??
          scrollContainer?.scrollWidth ??
          element.clientWidth,
        scrollLeft: scrollContainer?.scrollLeft ?? 0,
        zoomAttr: zoomValue,
      };

      setViewport((previous) => {
        if (
          Math.abs(previous.width - newState.width) < 0.5 &&
          Math.abs(previous.contentWidth - newState.contentWidth) < 0.5 &&
          Math.abs(previous.scrollLeft - newState.scrollLeft) < 0.5 &&
          Math.abs(previous.zoomAttr - newState.zoomAttr) < 0.01
        ) {
          return previous;
        }

        return newState;
      });
    };

    readState();

    const resizeObserver = new ResizeObserver(() => {
      readState();
    });

    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
      scrollContainer.addEventListener("scroll", readState, { passive: true });
    }

    if (trackElement && trackElement !== scrollContainer) {
      resizeObserver.observe(trackElement);
    }

    const mutationTarget =
      scrollContainer?.closest("[data-timeline-zoom]") ?? scrollContainer;
    let mutationObserver: MutationObserver | undefined;
    if (mutationTarget) {
      mutationObserver = new MutationObserver(() => {
        readState();
      });
      mutationObserver.observe(mutationTarget, {
        attributes: true,
        attributeFilter: ["data-timeline-zoom"],
      });
    }

    return () => {
      resizeObserver.disconnect();
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", readState);
      }
      mutationObserver?.disconnect();
    };
  }, [zoomProp]);

  const { majorTicks, minorTicks, majorInterval, contentWidth } =
    useMemo(() => {
      if (duration <= 0) {
        return {
          majorTicks: [],
          minorTicks: [],
          majorInterval: 1,
          contentWidth: Math.max(1, timelineWidth ?? viewport.width),
        };
      }

      const viewportWidth = Math.max(1, viewport.width);
      const measuredContentWidth = Math.max(
        1,
        timelineWidth ?? viewport.contentWidth ?? viewportWidth,
      );

      const pixelsPerSecond = measuredContentWidth / duration;
      if (!Number.isFinite(pixelsPerSecond) || pixelsPerSecond <= 0) {
        return {
          majorTicks: [],
          minorTicks: [],
          majorInterval: 1,
          contentWidth: measuredContentWidth,
        };
      }

      const majorIntervalValue = chooseMajorInterval(pixelsPerSecond);
      const minorIntervalValue = chooseMinorInterval(majorIntervalValue);

      const majorLines: { time: number; x: number }[] = [];
      const minorLines: { time: number; x: number }[] = [];

      const pushMajor = (time: number) => {
        const clampedTime = clampToRange(time, 0, duration);
        if (
          majorLines.some((line) => Math.abs(line.time - clampedTime) < EPSILON)
        ) {
          return;
        }

        majorLines.push({
          time: clampedTime,
          x: clampedTime * pixelsPerSecond,
        });
      };

      const majorTickCount = Math.floor(duration / majorIntervalValue);
      for (let index = 0; index <= majorTickCount; index += 1) {
        pushMajor(index * majorIntervalValue);
      }

      pushMajor(0);
      pushMajor(duration);

      const minorTickCount = Math.floor(duration / minorIntervalValue);
      for (let index = 0; index <= minorTickCount; index += 1) {
        const time = index * minorIntervalValue;
        if (time < -EPSILON || time - duration > EPSILON) {
          continue;
        }

        const clampedTime = clampToRange(time, 0, duration);
        if (
          majorLines.some((line) => Math.abs(line.time - clampedTime) < EPSILON)
        ) {
          continue;
        }

        minorLines.push({
          time: clampedTime,
          x: clampedTime * pixelsPerSecond,
        });
      }

      majorLines.sort((a, b) => a.time - b.time);
      minorLines.sort((a, b) => a.time - b.time);

      return {
        majorTicks: majorLines,
        minorTicks: minorLines,
        majorInterval: majorIntervalValue,
        contentWidth: measuredContentWidth,
      };
    }, [duration, timelineWidth, viewport]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-0 w-full h-full overflow-visible",
        className,
        "z-40",
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        width={Math.max(1, contentWidth)}
        height={RULER_HEIGHT}
        viewBox={`0 0 ${Math.max(1, contentWidth)} ${RULER_HEIGHT}`}
        style={{ display: "block" }}
      >
        <rect
          x={0}
          y={0}
          width={Math.max(1, contentWidth)}
          height={RULER_HEIGHT}
          fill="url(#timeline-ruler-bg)"
          opacity={0}
        />
        <defs>
          <linearGradient id="timeline-ruler-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(15, 23, 42, 0.0)" />
            <stop offset="1" stopColor="rgba(15, 23, 42, 0.05)" />
          </linearGradient>
        </defs>
        <line
          x1={0}
          y1={RULER_HEIGHT - 6}
          x2={Math.max(1, contentWidth)}
          y2={RULER_HEIGHT - 6}
          stroke="hsl(var(--border))"
          strokeOpacity={0.2}
          strokeWidth={1}
        />
        {minorTicks.map((tick) => (
          <line
            key={`minor-${tick.time.toFixed(5)}-${tick.x.toFixed(2)}`}
            x1={tick.x}
            y1={RULER_HEIGHT - 22}
            x2={tick.x}
            y2={RULER_HEIGHT - 6}
            stroke="hsl(var(--border))"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
        ))}
        {majorTicks.map((tick) => {
          const isStart = tick.time < EPSILON;
          const isEnd = Math.abs(tick.time - duration) < EPSILON;
          const textAnchor = isStart ? "start" : isEnd ? "end" : "middle";
          const dx = isStart ? 4 : isEnd ? -4 : 0;

          return (
            <g key={`major-${tick.time.toFixed(5)}-${tick.x.toFixed(2)}`}>
              <line
                x1={tick.x}
                y1={RULER_HEIGHT - 32}
                x2={tick.x}
                y2={RULER_HEIGHT - 6}
                stroke="hsl(var(--border))"
                strokeOpacity={0.55}
                strokeWidth={1.5}
              />
              <text
                x={tick.x + dx}
                y={RULER_HEIGHT - 38}
                textAnchor={textAnchor}
                fontSize={12}
                fill="hsl(var(--muted-foreground))"
                style={{ pointerEvents: "none" }}
              >
                {formatTickLabel(tick.time, majorInterval)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
