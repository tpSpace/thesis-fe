import { createProxyMiddleware } from "http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, // Add this to tell Next.js this route is handled externally
  },
};

const apiProxy = createProxyMiddleware({
  target: "http://backend.my-thesis.svc.cluster.local:4000",
  changeOrigin: true,
  pathRewrite: { "^/api/graphql": "/graphql" },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.statusCode = 500;
    res.end("Proxy error: " + err.message);
  },
  logLevel: "debug", // Helps with debugging
});

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    apiProxy(req, res, (err) => {
      if (err) {
        console.error("Proxy middleware error:", err);
        res.status(500).json({ error: "Proxy error" });
        return resolve();
      }
      resolve();
    });
  });
}
