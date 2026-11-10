"use client";

import { useMemo } from "react";
import type { ProductModelConfig } from "@/lib/productModels";
import { getGeneratedTexture, type GeneratedTextureKind } from "./textures";

function useMap(kind: GeneratedTextureKind | undefined, tint?: string) {
  return useMemo(() => (kind ? getGeneratedTexture(kind, tint) : null), [kind, tint]);
}

function SurfaceMaterial({
  config,
  roughness,
  clearcoat,
  mapKind,
  tint,
  forceWhite,
}: {
  config: ProductModelConfig;
  roughness?: number;
  clearcoat?: number;
  mapKind?: GeneratedTextureKind;
  tint?: string;
  /** Speckle and cane maps already contain color. */
  forceWhite?: boolean;
}) {
  const map = useMap(mapKind, tint);
  const coloredMap = mapKind === "speckle" || mapKind === "cane" || forceWhite;
  return (
    <meshPhysicalMaterial
      color={coloredMap ? "#ffffff" : config.color}
      map={map}
      roughness={roughness ?? config.roughness}
      metalness={config.metalness}
      clearcoat={clearcoat ?? config.clearcoat ?? 0}
      clearcoatRoughness={0.18}
    />
  );
}

function MetalMaterial({ color, roughness = 0.22 }: { color: string; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={1} roughness={roughness} />;
}

function Plywood({ config }: { config: ProductModelConfig }) {
  const plyCount = config.plyCount ?? 5;
  const width = 2.2;
  const depth = 1.35;
  const veneer = 0.02;
  const core = 0.028;
  const layers: { y: number; height: number; color: string; face: boolean }[] = [];
  let cursor = 0;
  layers.push({ y: veneer / 2, height: veneer, color: config.accent, face: false });
  cursor = veneer;
  for (let index = 0; index < plyCount; index += 1) {
    layers.push({
      y: cursor + core / 2,
      height: core * 0.9,
      color: index % 2 === 0 ? "#f3ddb0" : "#c79655",
      face: false,
    });
    cursor += core;
  }
  layers.push({ y: cursor + veneer / 2, height: veneer, color: config.color, face: true });

  return (
    <group rotation={[0.22, 0.62, 0]}>
      {layers.map((layer, index) => (
        <mesh key={index} position={[0, layer.y, 0]}>
          <boxGeometry args={[width, layer.height, depth]} />
          {layer.face ? (
            <SurfaceMaterial config={config} mapKind={config.surface} />
          ) : (
            <meshStandardMaterial color={layer.color} roughness={0.72} />
          )}
        </mesh>
      ))}
    </group>
  );
}

function Fibreboard({ config }: { config: ProductModelConfig }) {
  return (
    <mesh rotation={[0.2, 0.55, 0]}>
      <boxGeometry args={[2.15, 0.2, 1.32]} />
      <SurfaceMaterial config={config} mapKind="fibre" />
    </mesh>
  );
}

function ParticleBoard({ config }: { config: ProductModelConfig }) {
  return (
    <mesh rotation={[0.18, 0.58, 0]}>
      <boxGeometry args={[2.15, 0.22, 1.32]} />
      <SurfaceMaterial config={config} mapKind="speckle" tint={config.color} roughness={0.9} clearcoat={0} />
    </mesh>
  );
}

function Blockboard({ config }: { config: ProductModelConfig }) {
  const strips = 9;
  const width = 2.2;
  const depth = 1.25;
  const coreHeight = 0.22;
  const stripWidth = (width * 0.94) / strips;
  return (
    <group rotation={[0.16, 0.7, 0]}>
      {Array.from({ length: strips }, (_, index) => (
        <mesh
          key={index}
          position={[-((strips - 1) * stripWidth) / 2 + index * stripWidth, 0, 0]}
        >
          <boxGeometry args={[stripWidth * 0.86, coreHeight, depth * 0.9]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#e7c98a" : "#b8884f"} roughness={0.76} />
        </mesh>
      ))}
      <mesh position={[0, coreHeight / 2 + 0.012, 0]}>
        <boxGeometry args={[width, 0.028, depth]} />
        <SurfaceMaterial config={config} mapKind="wood" />
      </mesh>
      <mesh position={[0, -coreHeight / 2 - 0.012, 0]}>
        <boxGeometry args={[width, 0.024, depth]} />
        <meshStandardMaterial color="#d9c29a" roughness={0.62} />
      </mesh>
    </group>
  );
}

function BarPull({ config }: { config: ProductModelConfig }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 1.75, 0.07]} />
        <SurfaceMaterial config={config} mapKind={config.surface} />
      </mesh>
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.12, 24]} />
          <MetalMaterial color={config.accent} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.145]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.82, 32]} />
        <MetalMaterial color={config.accent} roughness={0.16} />
      </mesh>
      {[-0.41, 0.41].map((x) => (
        <mesh key={`cap-${x}`} position={[x, 0, 0.145]}>
          <sphereGeometry args={[0.034, 16, 16]} />
          <MetalMaterial color={config.accent} roughness={0.16} />
        </mesh>
      ))}
    </group>
  );
}

function Knob({ config }: { config: ProductModelConfig }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.2, 1.7, 0.07]} />
        <SurfaceMaterial config={config} mapKind={config.surface} />
      </mesh>
      <group position={[0, 0, 0.08]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.055, 0.07, 24]} />
          <MetalMaterial color={config.accent} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <sphereGeometry args={[0.11, 32, 24]} />
          <MetalMaterial color={config.accent} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function SlidingDoors({ config }: { config: ProductModelConfig }) {
  return (
    <group>
      <mesh position={[0, 0.86, 0]}>
        <boxGeometry args={[2.35, 0.07, 0.22]} />
        <MetalMaterial color={config.accent} roughness={0.32} />
      </mesh>
      <mesh position={[0, -0.86, 0]}>
        <boxGeometry args={[2.35, 0.06, 0.24]} />
        <MetalMaterial color={config.accent} roughness={0.35} />
      </mesh>
      <mesh position={[0.28, 0, -0.05]}>
        <boxGeometry args={[1.12, 1.58, 0.045]} />
        <SurfaceMaterial config={config} mapKind="wood" roughness={0.5} />
      </mesh>
      <mesh position={[-0.28, 0, 0.05]}>
        <boxGeometry args={[1.12, 1.58, 0.045]} />
        <meshPhysicalMaterial color="#efe2cc" roughness={0.42} clearcoat={0.12} />
      </mesh>
      <mesh position={[0.18, 0, 0.1]}>
        <boxGeometry args={[0.028, 0.28, 0.03]} />
        <MetalMaterial color={config.accent} roughness={0.2} />
      </mesh>
      <mesh position={[-0.08, 0, -0.1]}>
        <boxGeometry args={[0.028, 0.28, 0.03]} />
        <MetalMaterial color={config.accent} roughness={0.2} />
      </mesh>
    </group>
  );
}

function SwingDoor({ config }: { config: ProductModelConfig }) {
  return (
    <group>
      <mesh position={[-0.08, 0, -0.02]}>
        <boxGeometry args={[0.12, 1.85, 0.46]} />
        <meshStandardMaterial color="#2a241e" roughness={0.58} />
      </mesh>
      {[0.5, -0.5].map((y) => (
        <mesh key={y} position={[0.02, y, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.14, 20]} />
          <MetalMaterial color={config.accent} roughness={0.24} />
        </mesh>
      ))}
      <group position={[0.02, 0, 0.18]} rotation={[0, -0.65, 0]}>
        <mesh position={[0.58, 0, 0]}>
          <boxGeometry args={[1.16, 1.72, 0.05]} />
          <SurfaceMaterial config={config} clearcoat={0.25} />
        </mesh>
        <mesh position={[1.0, 0, 0.055]}>
          <boxGeometry args={[0.035, 0.34, 0.035]} />
          <MetalMaterial color={config.accent} roughness={0.22} />
        </mesh>
      </group>
    </group>
  );
}

function Wardrobe({ config }: { config: ProductModelConfig }) {
  const advanced = config.variant === "advanced";
  return (
    <group>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[1.15, 2.35, 0.42]} />
        <meshStandardMaterial color={advanced ? "#1c1f27" : "#d9d3c8"} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[1.05, 2.18, 0.05]} />
        <SurfaceMaterial config={config} />
      </mesh>
      {advanced ? (
        <>
          <mesh position={[0, 0, 0.19]}>
            <boxGeometry args={[0.78, 1.88, 0.012]} />
            <meshStandardMaterial color="#12141a" roughness={0.4} metalness={0.25} />
          </mesh>
          <mesh position={[0.38, 0, 0.26]}>
            <cylinderGeometry args={[0.018, 0.018, 0.72, 16]} />
            <MetalMaterial color={config.accent} roughness={0.2} />
          </mesh>
        </>
      ) : (
        <group position={[0.32, -0.05, 0.22]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.034, 0.04, 16]} />
            <MetalMaterial color={config.accent} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.055, 24, 16]} />
            <MetalMaterial color={config.accent} roughness={0.28} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Swatch({ config }: { config: ProductModelConfig }) {
  return (
    <group>
      <mesh position={[0, -0.62, 0.16]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.72, 0.035, 0.42]} />
        <meshStandardMaterial color="#2c261f" roughness={0.5} metalness={0.25} />
      </mesh>
      <mesh rotation={[-0.16, 0.35, 0]}>
        <boxGeometry args={[1.55, 1.12, 0.12]} />
        <SurfaceMaterial config={config} mapKind={config.surface} />
      </mesh>
    </group>
  );
}

function GlassPanel({ config }: { config: ProductModelConfig }) {
  return (
    <group rotation={[0, 0.35, 0]}>
      <mesh>
        <boxGeometry args={[1.46, 1.96, 0.07]} />
        <meshStandardMaterial color="#12141a" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[1.22, 1.7, 0.028]} />
        <meshPhysicalMaterial
          color={config.color}
          roughness={0.06}
          metalness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
    </group>
  );
}

function RattanPanel({ config }: { config: ProductModelConfig }) {
  return (
    <group rotation={[0, 0.4, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 1.92, 0.06]} />
        <meshStandardMaterial color={config.accent} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[1.16, 1.54, 0.02]} />
        <SurfaceMaterial config={config} mapKind="cane" forceWhite roughness={0.72} clearcoat={0} />
      </mesh>
    </group>
  );
}

export function ProductPlaceholder({ config }: { config: ProductModelConfig }) {
  switch (config.placeholder) {
    case "plywood":
      return <Plywood config={config} />;
    case "fibreboard":
      return <Fibreboard config={config} />;
    case "particle":
      return <ParticleBoard config={config} />;
    case "blockboard":
      return <Blockboard config={config} />;
    case "bar-pull":
      return <BarPull config={config} />;
    case "knob":
      return <Knob config={config} />;
    case "sliding":
      return <SlidingDoors config={config} />;
    case "swing":
      return <SwingDoor config={config} />;
    case "wardrobe":
      return <Wardrobe config={config} />;
    case "swatch":
      return <Swatch config={config} />;
    case "glass":
      return <GlassPanel config={config} />;
    case "rattan":
      return <RattanPanel config={config} />;
    default:
      return null;
  }
}
