import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const root = process.cwd();

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

async function prerender() {
  const vite = await createServer({
    root,
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: "custom",
    define: {
      "import.meta.env.SSR": "true",
    },
  });

  try {
    const { render } = (await vite.ssrLoadModule("/src/entry-server.tsx")) as {
      render: (url: string) => Promise<string>;
    };
    const appHtml = await render("/");

    // 1. Map hashed-asset paths using Vite manifest (non-inlined assets)
    const manifest = JSON.parse(
      readFileSync(path.resolve(root, "dist/.vite/manifest.json"), "utf-8"),
    ) as Record<string, { file: string }>;
    let patchedHtml = appHtml;
    for (const [src, entry] of Object.entries(manifest)) {
      patchedHtml = patchedHtml.replaceAll(`/${src}`, `/${entry.file}`);
    }

    // 2. Inline any remaining /src/assets/* paths (small files Vite inlined as base64
    //    in the client bundle, but ssrLoadModule returned as file paths)
    for (const match of patchedHtml.matchAll(/\/src\/assets\/([^"' >]+)/g)) {
      const relPath = match[1];
      const filePath = path.resolve(root, "src/assets", relPath);
      if (!existsSync(filePath)) continue;
      const ext = path.extname(relPath).slice(1).toLowerCase();
      const mime = MIME[ext] ?? `image/${ext}`;
      const b64 = readFileSync(filePath).toString("base64");
      patchedHtml = patchedHtml.replaceAll(
        `/src/assets/${relPath}`,
        `data:${mime};base64,${b64}`,
      );
    }

    const templatePath = path.resolve(root, "dist/index.html");
    const template = readFileSync(templatePath, "utf-8");
    const output = template.replace(
      '<div id="root"></div>',
      `<div id="root">${patchedHtml}</div>`,
    );
    writeFileSync(templatePath, output, "utf-8");
    console.log("✓ Pre-rendered / → dist/index.html");
  } finally {
    await vite.close();
  }
}

prerender().catch((err: unknown) => {
  console.error("Pre-render failed:", err);
  process.exit(1);
});
