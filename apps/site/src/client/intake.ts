import { fieldLabels, goalLabels } from "@afin/intake";
export { goalLabels } from "@afin/intake";

export function validateEndpoint(endpoint: string) {
  if (
    endpoint &&
    !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)
  ) {
    throw new Error(
      "FORMSPREE_ENDPOINT must be an https://formspree.io/f/ form URL",
    );
  }
  return endpoint;
}

export function introduction(data: FormData) {
  return [...data.entries()]
    .filter(([key, value]) => !key.startsWith("_") && String(value).trim())
    .map(
      ([key, value]) =>
        `${fieldLabels[key] || key}: ${key === "goals" ? goalLabels[String(value)] || value : key === "consent" ? "Yes" : value}`,
    )
    .join("\n");
}

export async function sendInquiry(
  endpoint: string,
  data: FormData,
  request: (url: string, options: RequestInit) => Promise<Response> = fetch,
) {
  validateEndpoint(endpoint);
  if (!endpoint) throw new Error("Direct delivery is not configured.");
  const response = await request(endpoint, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok)
    throw new Error(
      "Your inquiry could not be sent. Please try again or email Matt directly.",
    );
}
