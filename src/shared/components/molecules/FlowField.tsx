"use client";

import { useEffect, useRef } from "react";

interface CircularWaveProps {
  isScanning?: boolean;
}

export const FlowField = ({ isScanning = false }: CircularWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 400;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;
    ctx.scale(dpr, dpr);

    const center = size / 2;
    const gridDensity = 24;
    const squareSize = size * 0.8;
    const spacing = squareSize / (gridDensity - 1);
    const dashLength = 6;

    class LineDash {
      gridX: number;
      gridY: number;
      distanceFromCenter: number;
      polarAngle: number;
      rotation: number = 0;
      currentLength: number = dashLength;
      opacity: number = 1;
      x: number = 0;
      y: number = 0;

      constructor(row: number, col: number) {
        this.gridX = (col - (gridDensity - 1) / 2) * spacing;
        this.gridY = (row - (gridDensity - 1) / 2) * spacing;
        this.distanceFromCenter = Math.sqrt(this.gridX ** 2 + this.gridY ** 2);
        this.polarAngle = Math.atan2(this.gridY, this.gridX);
      }

      update(time: number, compressionFactor: number) {
        // --- FASE 1: VÓRTICE ---
        const waveSpeed = 0.03;
        const waveFrequency = 0.02;
        const radialWave = Math.sin(
          time * waveSpeed - this.distanceFromCenter * waveFrequency,
        );

        // Ángulo circular base
        const baseCircularAngle = this.polarAngle + Math.PI / 2;

        // --- FASE 2: COMPRESIÓN "PERPENDICULAR" ---
        // Al comprimirse, el ángulo rota para mirar al centro (polarAngle)
        // Interpolamos entre la tangente (vórtice) y el radio (perpendicular)
        const targetRotation = this.polarAngle;
        this.rotation =
          baseCircularAngle * (1 - compressionFactor) +
          targetRotation * compressionFactor +
          radialWave * 0.5 * (1 - compressionFactor);

        // Compresión espacial: los puntos viajan al centro
        const currentScale = 1 - compressionFactor * 0.75;
        this.x = center + this.gridX * currentScale;
        this.y = center + this.gridY * currentScale;

        // Longitud: se acorta hasta parecer un punto (perpendicular)
        this.currentLength = dashLength * (1 - compressionFactor * 0.8);
        this.opacity = (0.4 + radialWave * 0.2) * (1 + compressionFactor * 0.5);
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        const halfLength = this.currentLength / 2;
        ctx.beginPath();
        ctx.moveTo(-halfLength, 0);
        ctx.lineTo(halfLength, 0);
        ctx.stroke();

        ctx.restore();
      }
    }

    const lines = Array.from({ length: gridDensity * gridDensity }, (_, i) => {
      const row = Math.floor(i / gridDensity);
      const col = i % gridDensity;
      return new LineDash(row, col);
    });

    let compressionProgress = 0;

    const animate = () => {
      timeRef.current++;

      // Lógica de transición suave basada en el estado isScanning
      const target = isScanning ? 1 : 0;
      compressionProgress += (target - compressionProgress) * 0.08;

      // ctx.fillStyle = "#000000";
      //ctx.fillRect(0, 0, size, size);
      ctx.clearRect(0, 0, size, size);

      lines.forEach((line) => {
        line.update(timeRef.current, compressionProgress);
        line.draw(ctx);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isScanning]);

  return (
    <div className="w-full h-full transparent overflow-hidden rounded-none border-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
