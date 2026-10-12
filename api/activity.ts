import { handleActivity } from "../src/server/activity.js";
export default { fetch: (request: Request) => handleActivity(request) };
