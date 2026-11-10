# Product models

Drop `.glb` (preferred) or `.gltf` files in this folder, then point a product at the file.

1. Export with Y-up. Scale does not matter — the viewer fits the model in frame.
2. Save it here, for example `public/models/fin-laminate.glb`. Keep related `.bin` and texture files beside a `.gltf` if you are not using a packed GLB.
3. In `src/lib/productModels.ts`, set that product's `modelUrl` to the public path:

```ts
modelUrl: "/models/fin-laminate.glb",
```

The id in that catalog must match the product card id (`ply-…`, `brd-…`, `hw-…`, `fin-…`). Leave `modelUrl` as `null` to keep the procedural placeholder (plywood slab, hardware, or finish swatch).

A missing or unloadable file falls back to that placeholder. Full notes are in the repository README under **3D product viewer**.
