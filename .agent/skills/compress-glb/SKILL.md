---
description: How to compress GLB/glTF 3D model files for web use (PlayCanvas compatible)
---

# Compress GLB Files

Compress GLB 3D models exported from Blender for web delivery. Uses `@gltf-transform/cli` to reduce file size via texture resizing and cleanup while keeping mesh geometry intact for PlayCanvas compatibility.

## Important: No Mesh Compression

**Do NOT use Draco or meshopt mesh compression** — PlayCanvas cannot reliably decode them and will produce `GL_INVALID_OPERATION: Vertex buffer is not big enough` errors. Only optimize textures and prune unused data.

## Steps

### 1. Inspect the file first

```bash
npx -y @gltf-transform/cli inspect "<input.glb>"
```

Check the TEXTURES table for texture sizes and formats. This tells you where the bulk of the file size is.

### 2. Prune unused data

```bash
npx -y @gltf-transform/cli prune "<input.glb>" /tmp/model_pruned.glb
```

Removes unused accessors, materials, and textures.

### 3. Resize textures

Choose a target size based on the model's visual importance:

| Use Case | Texture Size | Typical Savings |
|----------|-------------|-----------------|
| Hero/featured model | 1024×1024 | ~70-80% |
| Secondary prop (pedestal, furniture) | 512×512 | ~85-93% |
| Background/distant object | 256×256 | ~95%+ |

```bash
npx -y @gltf-transform/cli resize /tmp/model_pruned.glb "<output.glb>" --width 512 --height 512
```

### 4. Verify

```bash
ls -lh "<output.glb>"
```

Check that the output size meets your target. If still too large, try a smaller texture size.

### 5. Clean up source file

Delete the original uncompressed GLB from the project root to keep the repo clean:

```bash
rm "<input.glb>"
```

## Full one-liner

// turbo-all

```bash
npx -y @gltf-transform/cli prune "<input.glb>" /tmp/model_temp.glb && npx -y @gltf-transform/cli resize /tmp/model_temp.glb "<output.glb>" --width 512 --height 512 && ls -lh "<output.glb>"
```

## Size Reference

From this project's pedestal model:

| Stage | Size |
|-------|------|
| Original Blender export | 10.5 MB |
| Prune only | 10.5 MB |
| + Resize to 1024 | 2.1 MB |
| + Resize to 512 | 651 KB |
| + Resize to 256 | 273 KB |
