/**
 * 3D viewer catalog.
 *
 * Every product card on /materials, /hardware, and /finishes looks up its
 * preview here by the card `id` passed to `CinematicDataCard`. Until a real
 * model exists, `modelUrl` stays null and the viewer builds a procedural
 * stand-in from `placeholder`, `color`, and the material settings below.
 *
 * Adding a real model:
 *   1. Export a GLB (preferred) or GLTF. Y-up, any scale — the viewer fits it.
 *   2. Put the file in `public/models/`, e.g. `public/models/fin-laminate.glb`.
 *   3. Set that product's `modelUrl` to the public path, e.g. "/models/fin-laminate.glb".
 *   4. Rebuild (or just refresh in `next dev`). A missing or broken file falls
 *      back to the procedural placeholder.
 *
 * See README → "3D product viewer" and `public/models/README.md`.
 */

export type PlaceholderKind =
  | "plywood"
  | "fibreboard"
  | "particle"
  | "blockboard"
  | "bar-pull"
  | "knob"
  | "sliding"
  | "swing"
  | "wardrobe"
  | "swatch"
  | "glass"
  | "rattan";

export type SurfaceTexture = "wood" | "fibre" | "speckle" | "cane";

export type WardrobeVariant = "advanced" | "standard";

export interface ProductModelConfig {
  /** Must match the `id` on the product's CinematicDataCard. */
  id: string;
  title: string;
  categoryLabel: string;
  /**
   * Public URL of a .glb or .gltf, for example "/models/fin-laminate.glb".
   * Null keeps the procedural placeholder.
   */
  modelUrl: string | null;
  placeholder: PlaceholderKind;
  /** Primary surface color. */
  color: string;
  /** Metal, frame, core, or backing color. */
  accent: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  /** Grayscale maps are tinted by `color`. Speckle and cane are baked in full color. */
  surface?: SurfaceTexture;
  /** Visible veneer count for the plywood placeholder. */
  plyCount?: number;
  variant?: WardrobeVariant;
}

const PRODUCT_MODELS: readonly ProductModelConfig[] = [
  {
    id: "ply-mr-grade",
    title: "MR Grade 303",
    categoryLabel: "Plywood",
    modelUrl: null,
    placeholder: "plywood",
    color: "#E4C48A",
    accent: "#C49A62",
    roughness: 0.62,
    metalness: 0,
    surface: "wood",
    plyCount: 5,
  },
  {
    id: "ply-bwr-grade",
    title: "BWR Grade 303",
    categoryLabel: "Plywood",
    modelUrl: null,
    placeholder: "plywood",
    color: "#C4894A",
    accent: "#8C5A32",
    roughness: 0.5,
    metalness: 0,
    clearcoat: 0.08,
    surface: "wood",
    plyCount: 7,
  },
  {
    id: "ply-bwp-grade",
    title: "BWP Grade 710",
    categoryLabel: "Plywood",
    modelUrl: null,
    placeholder: "plywood",
    color: "#8C4E32",
    accent: "#5C3424",
    roughness: 0.4,
    metalness: 0,
    clearcoat: 0.22,
    surface: "wood",
    plyCount: 9,
  },
  {
    id: "brd-hdhmr",
    title: "HDHMR",
    categoryLabel: "Engineered board",
    modelUrl: null,
    placeholder: "fibreboard",
    color: "#C4A484",
    accent: "#8A6A4E",
    roughness: 0.38,
    metalness: 0.02,
    clearcoat: 0.08,
    surface: "fibre",
  },
  {
    id: "brd-mdf",
    title: "MDF",
    categoryLabel: "Engineered board",
    modelUrl: null,
    placeholder: "fibreboard",
    color: "#E4D5C5",
    accent: "#C9B8A4",
    roughness: 0.3,
    metalness: 0,
    clearcoat: 0.12,
    surface: "fibre",
  },
  {
    id: "brd-particle-board",
    title: "Particle Board",
    categoryLabel: "Engineered board",
    modelUrl: null,
    placeholder: "particle",
    color: "#E8D2A4",
    accent: "#C4A574",
    roughness: 0.88,
    metalness: 0,
    surface: "speckle",
  },
  {
    id: "brd-blockboard",
    title: "Blockboard",
    categoryLabel: "Engineered board",
    modelUrl: null,
    placeholder: "blockboard",
    color: "#F0D7A6",
    accent: "#C4A36A",
    roughness: 0.52,
    metalness: 0,
    surface: "wood",
  },
  {
    id: "hw-german",
    title: "German-Based Accessories",
    categoryLabel: "Hardware",
    modelUrl: null,
    placeholder: "bar-pull",
    color: "#4E382C",
    accent: "#E4E7EE",
    roughness: 0.42,
    metalness: 0,
    surface: "wood",
  },
  {
    id: "hw-indian",
    title: "Indian-Based Accessories",
    categoryLabel: "Hardware",
    modelUrl: null,
    placeholder: "knob",
    color: "#C4A06A",
    accent: "#C6A15A",
    roughness: 0.5,
    metalness: 0,
    surface: "wood",
  },
  {
    id: "hw-sliding",
    title: "Sliding Wardrobe",
    categoryLabel: "Wardrobe system",
    modelUrl: null,
    placeholder: "sliding",
    color: "#C4A574",
    accent: "#D5DAE2",
    roughness: 0.46,
    metalness: 0,
    surface: "wood",
  },
  {
    id: "hw-swing",
    title: "Swing Wardrobe",
    categoryLabel: "Wardrobe system",
    modelUrl: null,
    placeholder: "swing",
    color: "#F4F0E8",
    accent: "#C5CCD6",
    roughness: 0.4,
    metalness: 0,
    clearcoat: 0.2,
  },
  {
    id: "hw-advanced",
    title: "Advanced Full-Height Technology",
    categoryLabel: "Full-height system",
    modelUrl: null,
    placeholder: "wardrobe",
    color: "#2A2E38",
    accent: "#E0B15A",
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 0.4,
    variant: "advanced",
  },
  {
    id: "hw-standard",
    title: "Standard Local Systems",
    categoryLabel: "Full-height system",
    modelUrl: null,
    placeholder: "wardrobe",
    color: "#E7E1D6",
    accent: "#B7BEC8",
    roughness: 0.55,
    metalness: 0,
    variant: "standard",
  },
  {
    id: "fin-laminate",
    title: "Laminate Sheets",
    categoryLabel: "Sheet finish",
    modelUrl: null,
    placeholder: "swatch",
    color: "#C49A6C",
    accent: "#8C6239",
    roughness: 0.55,
    metalness: 0,
    clearcoat: 0.06,
    surface: "wood",
  },
  {
    id: "fin-acrylic",
    title: "Acrylic Sheets",
    categoryLabel: "Sheet finish",
    modelUrl: null,
    placeholder: "swatch",
    color: "#F7F4EF",
    accent: "#E7E2D8",
    roughness: 0.06,
    metalness: 0,
    clearcoat: 1,
  },
  {
    id: "fin-duco",
    title: "DUCO Paint",
    categoryLabel: "Paint finish",
    modelUrl: null,
    placeholder: "swatch",
    color: "#3C3330",
    accent: "#2A2422",
    roughness: 0.32,
    metalness: 0.04,
    clearcoat: 0.45,
  },
  {
    id: "fin-pu",
    title: "PU Paint",
    categoryLabel: "Paint finish",
    modelUrl: null,
    placeholder: "swatch",
    color: "#F3F0EA",
    accent: "#E4DDD2",
    roughness: 0.05,
    metalness: 0,
    clearcoat: 1,
  },
  {
    id: "fin-lacquered-glass",
    title: "Lacquered Glass",
    categoryLabel: "Specialty finish",
    modelUrl: null,
    placeholder: "glass",
    color: "#12382F",
    accent: "#1A1C22",
    roughness: 0.08,
    metalness: 0.04,
    clearcoat: 1,
  },
  {
    id: "fin-rattan",
    title: "Rattan",
    categoryLabel: "Specialty finish",
    modelUrl: null,
    placeholder: "rattan",
    color: "#D7B48A",
    accent: "#6B4423",
    roughness: 0.78,
    metalness: 0,
    surface: "cane",
  },
];

const BY_ID: Readonly<Record<string, ProductModelConfig>> = Object.fromEntries(
  PRODUCT_MODELS.map((product) => [product.id, product]),
);

export function getProductModel(id: string): ProductModelConfig | undefined {
  return BY_ID[id];
}

export function listProductModels(): readonly ProductModelConfig[] {
  return PRODUCT_MODELS;
}
