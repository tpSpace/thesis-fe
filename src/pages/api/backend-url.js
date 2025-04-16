import k8s from "@kubernetes/client-node";

export default async function handler(req, res) {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const maxRetries = 5;
    const delayMs = 30000;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const service = await k8sApi.readNamespacedService(
          "backend",
          "my-thesis"
        );
        const ingress = service.body.status.loadBalancer.ingress[0];
        if (!ingress) throw new Error("LoadBalancer IP not yet assigned");
        const publicEndpoint = ingress.ip || ingress.hostname;
        const backendUrl = `http://${publicEndpoint}:4000`;
        return res.status(200).json({ backendUrl });
      } catch (err) {
        if (i === maxRetries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  } catch (err) {
    console.error("Error fetching public IP:", err);
    res.status(500).json({ error: "Failed to fetch backend URL" });
  }
}
