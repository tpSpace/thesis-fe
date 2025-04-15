// src/pages/api/graphql.js
import { createProxyMiddleware } from "http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: "http://backend:4000",
  changeOrigin: true,
  pathRewrite: { "^/api/graphql": "/graphql" },
});

export default function handler(req, res) {
  proxy(req, res, (err) => {
    if (err) {
      throw err;
    }
  });
}
