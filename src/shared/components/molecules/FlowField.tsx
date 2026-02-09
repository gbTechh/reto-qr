"use client";

import { useEffect, useRef } from "react";

interface CircularWaveProps {
  isScanning?: boolean;
}

const GRID_DENSITY = 24;
const SIZE = 400;
const DASH_LENGTH = 6;
const SQUARE_SIZE = SIZE * 0.8;
const SPACING = SQUARE_SIZE / (GRID_DENSITY - 1);
const CENTER = SIZE / 2;

class LineDash {
  gridX: number;
  gridY: number;
  distanceFromCenter: number;
  polarAngle: number;
  rotation: number = 0;
  currentLength: number = DASH_LENGTH;
  opacity: number = 1;
  x: number = 0;
  y: number = 0;

  constructor(row: number, col: number) {
    // Calculo de la posición base
    this.gridX = (col - (GRID_DENSITY - 1) / 2) * SPACING;
    this.gridY = (row - (GRID_DENSITY - 1) / 2) * SPACING;
    this.distanceFromCenter = Math.sqrt(this.gridX ** 2 + this.gridY ** 2);
    this.polarAngle = Math.atan2(this.gridY, this.gridX);

    this.x = CENTER + this.gridX;
    this.y = CENTER + this.gridY;
  }

  update(time: number, compressionFactor: number) {
    const waveSpeed = 0.03;
    const waveFrequency = 0.02;

    const radialWave = Math.sin(
      time * waveSpeed - this.distanceFromCenter * waveFrequency,
    );

    const baseCircularAngle = this.polarAngle + Math.PI / 2;
    const targetRotation = this.polarAngle;

    this.rotation =
      baseCircularAngle * (1 - compressionFactor) +
      targetRotation * compressionFactor +
      radialWave * 0.5 * (1 - compressionFactor);
    this.currentLength = DASH_LENGTH;

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

export const FlowField = ({ isScanning = false }: CircularWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const timeRef = useRef<number>(0);

  const isScanningRef = useRef(isScanning);

  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;
    ctx.scale(dpr, dpr);

    const lines = Array.from(
      { length: GRID_DENSITY * GRID_DENSITY },
      (_, i) => {
        const row = Math.floor(i / GRID_DENSITY);
        const col = i % GRID_DENSITY;
        return new LineDash(row, col);
      },
    );

    let compressionProgress = 0;

    const animate = () => {
      // --- CONTROL DE VELOCIDAD ---
      const speedMultiplier = isScanningRef.current ? 6 : 1;
      timeRef.current += 1 * speedMultiplier;

      const targetCompression = isScanningRef.current ? 1 : 0;
      compressionProgress += (targetCompression - compressionProgress) * 0.08;

      ctx.clearRect(0, 0, SIZE, SIZE);

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
  }, []);

  return (
    <div className="w-full h-full transparent overflow-hidden rounded-none border-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
