import { handleActivity } from "../src/server/activity";
export default { fetch: (request: Request) => handleActivity(request) };
