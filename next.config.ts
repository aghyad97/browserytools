import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/tools/bg-removal",
        headers: [{ key: "Cross-Origin-Opener-Policy", value: "same-origin" }],
      },
      {
        // Apply specific headers to static assets
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply headers to images
        source: "/(.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
  productionBrowserSourceMaps: false,
  compress: true,
  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  /**
   * Pin @imgly/background-removal to the onnxruntime-web version it declares.
   *
   * imgly 1.7.0 declares `peerDependencies: { "onnxruntime-web": "1.21.0" }`,
   * and downloads its wasm + model from
   * `staticimgly.com/@imgly/background-removal-data/1.7.0/dist/` — assets built
   * against that same 1.21.0. But the installed peer resolved to 1.26.0-dev
   * (deduped with the copy @huggingface/transformers pulls), so the newer JS
   * called wasm exports the 1.21-era binary does not have. That surfaced as
   * `webgpuInit is not a function` where WebGPU is available, and as
   * `_OrtGetInputOutputMetadata is not a function` on the plain session path
   * where it is not — both fatal, so the tool was broken for everyone.
   *
   * Fixed by scope, not by force: `onnxruntime-web-imgly` is an npm alias of
   * onnxruntime-web@1.21.0, and only requests issued from inside imgly are
   * redirected to it. A global override was the alternative and is wrong here:
   * @huggingface/transformers needs 1.26.0-dev and @diffusionstudio/vits-web
   * needs 1.18.0, so all three consumers must keep their own version.
   */
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^onnxruntime-web(\/.*)?$/,
        (resource: { request: string; contextInfo?: { issuer?: string } }) => {
          const issuer = resource.contextInfo?.issuer ?? "";
          if (!issuer.includes("@imgly/background-removal")) return;
          resource.request = resource.request.replace(
            /^onnxruntime-web/,
            "onnxruntime-web-imgly",
          );
        },
      ),
    );
    return config;
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    // Vercel's default build container OOMs on this site's webpack compile;
    // trades some build speed for a lower memory ceiling.
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
