"use client";

import { Component, Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { ProductModelConfig } from "@/lib/productModels";
import { ProductPlaceholder } from "./placeholders";
import type { ViewerApi } from "./types";

const MIN_DISTANCE = 2.55;
const MAX_DISTANCE = 6.4;
const TARGET = new THREE.Vector3(0, 0, 0);

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(): void {
    this.props.onError?.();
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function LoadingSlab() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.6;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.3, 0.16, 0.85]} />
      <meshStandardMaterial color="#FBBF24" wireframe />
    </mesh>
  );
}

function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);
  // dispose={null} keeps the cached GLTF geometries alive for the next open.
  return <primitive object={clone} dispose={null} />;
}

function Fitted({
  children,
  onFit,
}: {
  children: ReactNode;
  onFit: (bottomY: number) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    group.position.set(0, 0, 0);
    group.scale.set(1, 1, 1);
    group.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.15 / maxDim;
    group.scale.setScalar(scale);
    group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    onFit((-size.y * scale) / 2);
  }, [onFit]);
  return <group ref={ref}>{children}</group>;
}

function ViewerControls({
  reducedMotion,
  apiRef,
}: {
  reducedMotion: boolean;
  apiRef: MutableRefObject<ViewerApi | null>;
}) {
  const camera = useThree((state) => state.camera);
  const controls = useRef<OrbitControlsImpl>(null);

  const dolly = useCallback(
    (factor: number) => {
      const orbit = controls.current;
      if (!orbit) return;
      const offset = new THREE.Vector3().copy(camera.position).sub(orbit.target);
      const next = THREE.MathUtils.clamp(offset.length() * factor, MIN_DISTANCE, MAX_DISTANCE);
      offset.setLength(next);
      camera.position.copy(orbit.target).add(offset);
      orbit.update();
    },
    [camera],
  );

  useLayoutEffect(() => {
    controls.current?.saveState();
    apiRef.current = {
      zoomIn: () => dolly(0.86),
      zoomOut: () => dolly(1.16),
      reset: () => controls.current?.reset(),
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, dolly]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={TARGET}
      enablePan={false}
      enableZoom
      enableRotate
      autoRotate={!reducedMotion}
      autoRotateSpeed={0.75}
      zoomSpeed={0.55}
      rotateSpeed={0.85}
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 1.9}
      enableDamping
      dampingFactor={0.08}
      keyEvents
    />
  );
}

function SceneContents({
  config,
  reducedMotion,
  apiRef,
  onModelError,
}: {
  config: ProductModelConfig;
  reducedMotion: boolean;
  apiRef: MutableRefObject<ViewerApi | null>;
  onModelError?: () => void;
}) {
  const [floorY, setFloorY] = useState(-0.7);
  const onFit = useCallback((bottomY: number) => {
    setFloorY((current) => (Math.abs(current - bottomY) < 0.001 ? current : bottomY));
  }, []);
  const placeholder = <ProductPlaceholder config={config} />;

  return (
    <>
      <hemisphereLight args={["#f7f1e6", "#141824", 0.55]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4.5, 6, 3]} intensity={2.5} color="#fff5e8" />
      <directionalLight position={[-5, 2.2, -2]} intensity={0.65} color="#c9d6ff" />
      <Environment resolution={128} frames={1} environmentIntensity={0.85}>
        <Lightformer form="rect" intensity={3.2} position={[0, 3.2, 2]} scale={[7, 2, 1]} color="#fff8f0" />
        <Lightformer form="rect" intensity={1.1} position={[-4, 1, 1]} scale={[2, 4, 1]} color="#d5e2ff" />
        <Lightformer form="rect" intensity={1.6} position={[4, 1.2, -1]} scale={[2, 3, 1]} color="#ffe2b8" />
      </Environment>

      <ModelErrorBoundary
        fallback={
          <Fitted onFit={onFit}>
            <ProductPlaceholder config={config} />
          </Fitted>
        }
        onError={onModelError}
      >
        <Suspense fallback={<LoadingSlab />}>
          <Fitted onFit={onFit}>
            {config.modelUrl ? <GlbModel url={config.modelUrl} /> : placeholder}
          </Fitted>
        </Suspense>
      </ModelErrorBoundary>

      <ContactShadows
        position={[0, floorY - 0.004, 0]}
        opacity={0.48}
        scale={8}
        blur={2.5}
        far={3.2}
        resolution={256}
        color="#000000"
      />
      <ViewerControls reducedMotion={reducedMotion} apiRef={apiRef} />
    </>
  );
}

export interface ProductSceneProps {
  config: ProductModelConfig;
  reducedMotion: boolean;
  apiRef: MutableRefObject<ViewerApi | null>;
  onModelError?: () => void;
  onContextLost?: () => void;
}

export default function ProductScene({
  config,
  reducedMotion,
  apiRef,
  onModelError,
  onContextLost,
}: ProductSceneProps) {
  return (
    <Canvas
      camera={{ position: [2.55, 1.45, 3.15], fov: 34, near: 0.1, far: 40 }}
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.domElement.tabIndex = 0;
        gl.domElement.style.outline = "none";
        gl.domElement.setAttribute(
          "aria-label",
          `${config.title}. Drag to rotate, scroll or pinch to zoom.`,
        );
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          onContextLost?.();
        });
      }}
    >
      <SceneContents
        config={config}
        reducedMotion={reducedMotion}
        apiRef={apiRef}
        onModelError={onModelError}
      />
    </Canvas>
  );
}
