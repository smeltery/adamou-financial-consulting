import { handleActivity } from "../apps/site/src/server/activity.js";
export default { fetch: (request: Request) => handleActivity(request) };
