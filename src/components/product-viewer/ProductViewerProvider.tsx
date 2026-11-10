"use client";

import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Box, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { getProductModel, type ProductModelConfig } from "@/lib/productModels";
import type { ViewerApi } from "./types";
import { detectWebGL } from "./webgl";

interface ProductViewerContextValue {
  open: (productId: string) => void;
}

const ProductViewerContext = createContext<ProductViewerContextValue | null>(null);

export function useProductViewer(): ProductViewerContextValue | null {
  return useContext(ProductViewerContext);
}

type WebglState = "ready" | "unavailable";
type ModelState = "placeholder" | "model" | "failed";

const ProductScene = dynamic(() => import("./ProductScene"), {
  ssr: false,
  loading: () => <SceneLoading />,
});

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function SceneLoading() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="absolute inset-0 flex items-center justify-center text-sm text-surface-400">
      {reduced ? (
        "Loading 3D preview…"
      ) : (
        <span className="h-10 w-10 rounded-full border-2 border-amber-400/30 border-t-amber-300 animate-spin" />
      )}
    </div>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StaticPreview({ config, message }: { config: ProductModelConfig; message: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div
        className="h-28 w-40 rounded-xl border border-white/10 shadow-[0_24px_40px_rgba(0,0,0,0.35)]"
        style={{
          background: `linear-gradient(145deg, ${config.color} 0%, ${config.accent} 100%)`,
          transform: "perspective(700px) rotateX(16deg) rotateY(-22deg)",
        }}
        aria-hidden
      />
      <p className="max-w-sm text-sm leading-relaxed text-surface-300">{message}</p>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#0A0A0C]/80 text-white/80 backdrop-blur-md transition-colors hover:border-amber-400/40 hover:text-amber-300"
    >
      {children}
    </button>
  );
}

function ProductViewerModal({
  config,
  reducedMotion,
  onClose,
}: {
  config: ProductModelConfig;
  reducedMotion: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const apiRef = useRef<ViewerApi | null>(null);
  // The dialog mounts only after a click, so this runs in the browser.
  const [webgl, setWebgl] = useState<WebglState>(() => (detectWebGL() ? "ready" : "unavailable"));
  const [modelState, setModelState] = useState<ModelState>(config.modelUrl ? "model" : "placeholder");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const gesture = reducedMotion
    ? "Drag to rotate. Scroll or pinch to zoom. Auto-rotate stays off because reduced motion is enabled."
    : "Drag to rotate. Scroll or pinch to zoom. It turns gently until you take over.";
  const note =
    modelState === "failed"
      ? "That model file didn’t load, so this is the procedural stand-in."
      : modelState === "model"
        ? "Showing the GLB linked for this product."
        : "Procedural preview — add a GLB in public/models to replace it.";

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Close 3D viewer"
        className="absolute inset-0 bg-[#05050A]/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-viewer-title"
        initial={reducedMotion ? false : { y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reducedMotion ? undefined : { y: 20, opacity: 0 }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
        className="relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0A0A0C] shadow-[0_32px_64px_rgba(0,0,0,0.5)] sm:max-h-[88vh] sm:max-w-3xl sm:rounded-3xl"
      >
        <div className="flex justify-center pt-3 sm:hidden" aria-hidden>
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>
        <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-3 sm:px-6 sm:pt-5">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">{config.categoryLabel}</p>
            <h2 id="product-viewer-title" className="mt-1 text-lg font-bold leading-tight text-white sm:text-xl">
              {config.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-xl p-2 transition-colors hover:bg-white/[0.06]"
          >
            <X className="h-5 w-5 text-surface-400" />
          </button>
        </div>

        <div className="relative h-[min(58vh,520px)] min-h-[260px] w-full">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 78%, rgba(251,191,36,0.08), transparent 46%), #08090f",
            }}
          />
          {webgl === "unavailable" && (
            <StaticPreview
              config={config}
              message="This browser can’t start WebGL, so the model stays as a still swatch. Specs on the card are unchanged."
            />
          )}
          {webgl === "ready" && (
            <SceneErrorBoundary
              fallback={
                <StaticPreview
                  config={config}
                  message="The 3D view couldn’t start in this browser. Specs on the card are unchanged."
                />
              }
            >
              <ProductScene
                key={config.id}
                config={config}
                reducedMotion={reducedMotion}
                apiRef={apiRef}
                onModelError={() => setModelState("failed")}
                onContextLost={() => setWebgl("unavailable")}
              />
            </SceneErrorBoundary>
          )}
          {webgl === "ready" && (
            <div className="absolute bottom-3 right-3 flex flex-col gap-2">
              <ControlButton label="Zoom in" onClick={() => apiRef.current?.zoomIn()}>
                <ZoomIn className="h-4 w-4" />
              </ControlButton>
              <ControlButton label="Zoom out" onClick={() => apiRef.current?.zoomOut()}>
                <ZoomOut className="h-4 w-4" />
              </ControlButton>
              <ControlButton label="Reset view" onClick={() => apiRef.current?.reset()}>
                <RotateCcw className="h-4 w-4" />
              </ControlButton>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.06] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="text-xs leading-relaxed text-surface-300">{gesture}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-surface-500">{note}</p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
            <Box className="h-3 w-3" aria-hidden />
            {modelState === "model" ? "GLB" : "Preview"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductViewerProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const config = activeId ? getProductModel(activeId) ?? null : null;

  const open = useCallback((productId: string) => {
    if (getProductModel(productId)) setActiveId(productId);
  }, []);
  const close = useCallback(() => setActiveId(null), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <ProductViewerContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {config && (
          <ProductViewerModal key={config.id} config={config} reducedMotion={reducedMotion} onClose={close} />
        )}
      </AnimatePresence>
    </ProductViewerContext.Provider>
  );
}
