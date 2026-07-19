import { useEffect } from "react";

export default function AnimatedFavicon() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const icon = (document.querySelector('link[rel="icon"]') ||
      document.createElement("link")) as HTMLLinkElement;
    icon.rel = "icon";
    if (!icon.parentNode) document.head.appendChild(icon);

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = reducedMotion ? 23 : 0;
    const drawPath = (points: number[][], progress: number) => {
      const segments = points.length - 1;
      const scaled = Math.min(progress * segments, segments);
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 0; i < Math.floor(scaled); i += 1)
        ctx.lineTo(points[i + 1][0], points[i + 1][1]);
      const partial = scaled - Math.floor(scaled);
      if (partial > 0 && Math.floor(scaled) < segments) {
        const from = points[Math.floor(scaled)];
        const to = points[Math.floor(scaled) + 1];
        ctx.lineTo(from[0] + (to[0] - from[0]) * partial, from[1] + (to[1] - from[1]) * partial);
      }
      ctx.stroke();
    };

    const render = () => {
      const progress = reducedMotion ? 1 : Math.min((frame % 28) / 18, 1);
      ctx.clearRect(0, 0, 32, 32);
      ctx.fillStyle = "#090b0d";
      ctx.fillRect(0, 0, 32, 32);
      ctx.strokeStyle = "#e8ecef";
      ctx.lineWidth = 3;
      ctx.lineCap = "square";
      drawPath(
        [
          [19, 7],
          [7, 7],
          [7, 20]
        ],
        progress
      );
      drawPath(
        [
          [13, 25],
          [25, 25],
          [25, 12]
        ],
        progress
      );
      const pulse = reducedMotion ? 1 : 0.72 + Math.sin(frame * 0.32) * 0.28;
      ctx.fillStyle = "#25d4ff";
      ctx.globalAlpha = progress * pulse;
      ctx.beginPath();
      ctx.arc(16, 16, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      icon.href = canvas.toDataURL("image/png");
      frame += 1;
    };

    let timer: number | undefined;
    const start = () => {
      if (reducedMotion || document.hidden || timer !== undefined) return;
      timer = window.setInterval(render, 120);
    };
    const stop = () => {
      if (timer === undefined) return;
      window.clearInterval(timer);
      timer = undefined;
    };
    const handleVisibility = () => (document.hidden ? stop() : start());

    render();
    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
