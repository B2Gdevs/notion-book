"use client";
import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "../../lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const noise = createNoise3D();
  let w: number, h: number, nt: number, i: number, x: number, ctx: any, canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedBackgroundColor, setComputedBackgroundColor] = useState("white");

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");

    const updateCanvasSize = () => {
      if (containerRef.current) {
        w = ctx.canvas.width = containerRef.current.clientWidth;
        h = ctx.canvas.height = containerRef.current.clientHeight;
        ctx.filter = `blur(${blur}px)`;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    nt = 0;
    render();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  };

  const waveColors = colors ?? ["#425f57", "#fef5ed", "#2b2b2b", "#1a1a1a", "#FFBB5C"];
  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    ctx.fillStyle = computedBackgroundColor;
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(waveColors.length);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [computedBackgroundColor]);

  useEffect(() => {
    // Compute the background color from the Tailwind class
    const colorElement = document.createElement("div");
    colorElement.className = backgroundFill ?? "bg-white"; // Set Tailwind class
    document.body.appendChild(colorElement);
    const computedStyle = window.getComputedStyle(colorElement);
    setComputedBackgroundColor(computedStyle.backgroundColor);
    document.body.removeChild(colorElement); // Clean up
  }, [backgroundFill]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden h-full w-full", containerClassName)}
    >
      <canvas
        className={cn("absolute inset-0 z-0 rounded-lg", className)}
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
