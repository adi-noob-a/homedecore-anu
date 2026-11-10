import * as THREE from "three";

export type GeneratedTextureKind = "wood" | "fibre" | "speckle" | "cane";

const cache = new Map<string, THREE.CanvasTexture>();

function paintWood(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = "#cfcfcf";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 90; i += 1) {
    const y = (i / 90) * size;
    const wobble = Math.sin(i * 0.7) * 5;
    ctx.strokeStyle = i % 6 === 0 ? "rgba(30,30,30,0.22)" : "rgba(70,70,70,0.1)";
    ctx.lineWidth = i % 6 === 0 ? 2.5 : 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(size * 0.35, y + wobble, size * 0.65, y - wobble * 0.6, size, y + wobble * 0.25);
    ctx.stroke();
  }
}

function paintFibre(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 140; i += 1) {
    const y = (i / 140) * size;
    ctx.strokeStyle = `rgba(90,90,90,${0.04 + (i % 4) * 0.02})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + Math.sin(i * 0.4) * 1.5);
    ctx.stroke();
  }
}

function paintSpeckle(ctx: CanvasRenderingContext2D, size: number, tint: string): void {
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 1 + Math.random() * 3.4;
    ctx.fillStyle = Math.random() > 0.55 ? "rgba(92, 62, 28, 0.38)" : "rgba(255, 244, 220, 0.45)";
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * (0.45 + Math.random() * 0.7), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintCane(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = "#c9a36b";
  ctx.fillRect(0, 0, size, size);
  const step = 16;
  ctx.lineCap = "round";
  ctx.lineWidth = 5;
  for (let y = 0; y <= size; y += step) {
    ctx.strokeStyle = (y / step) % 2 === 0 ? "#a57c45" : "#edd7ae";
    ctx.beginPath();
    for (let x = 0; x <= size; x += 4) {
      const wobble = Math.sin(x * 0.18 + y) * 2.2;
      if (x === 0) ctx.moveTo(x, y + wobble);
      else ctx.lineTo(x, y + wobble);
    }
    ctx.stroke();
  }
  for (let x = 0; x <= size; x += step) {
    ctx.strokeStyle = (x / step) % 2 === 0 ? "#8d6436" : "#f3e2c0";
    ctx.beginPath();
    for (let y = 0; y <= size; y += 4) {
      const wobble = Math.sin(y * 0.18 + x) * 2.2;
      if (y === 0) ctx.moveTo(x + wobble, y);
      else ctx.lineTo(x + wobble, y);
    }
    ctx.stroke();
  }
}

function paint(kind: GeneratedTextureKind, tint: string | undefined, size: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create a canvas for the product texture.");
  }
  if (kind === "wood") paintWood(ctx, size);
  else if (kind === "fibre") paintFibre(ctx, size);
  else if (kind === "speckle") paintSpeckle(ctx, size, tint ?? "#e8d2a4");
  else paintCane(ctx, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** Cached procedural maps. Only call from the client-side viewer chunk. */
export function getGeneratedTexture(kind: GeneratedTextureKind, tint?: string): THREE.Texture {
  const key = `${kind}:${tint ?? ""}`;
  const existing = cache.get(key);
  if (existing) return existing;
  const texture = paint(kind, tint, kind === "cane" || kind === "speckle" ? 512 : 256);
  cache.set(key, texture);
  return texture;
}
