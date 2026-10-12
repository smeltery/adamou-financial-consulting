import { receiveWebhook } from "../server/webhook.js";
export default { fetch: (request: Request) => receiveWebhook(request) };
