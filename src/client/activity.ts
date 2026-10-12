import { recentEvents } from "../activity/events";

const region = document.querySelector<HTMLElement>("#inquiry-activity");
if (region?.dataset.enabled === "true") {
  const stack = region.querySelector<HTMLElement>(".activity-stack")!;
  const template =
    document.querySelector<HTMLTemplateElement>("#inquiry-toast")!;
  const key = "afin:inquiry-activity";
  const read = (name: string) => {
    try {
      return sessionStorage.getItem(name);
    } catch {
      return null;
    }
  };
  const write = (name: string, value: string) => {
    try {
      sessionStorage.setItem(name, value);
    } catch {
      /* In-memory state still prevents repeats on this page. */
    }
  };
  let seen: string[] = [];
  try {
    const stored = JSON.parse(read(key) || "[]");
    if (Array.isArray(stored))
      seen = stored.filter((id) => typeof id === "string").slice(-100);
  } catch {
    /* Ignore malformed nonessential display preferences. */
  }
  let dismissed = read(`${key}:hidden`) === "true";
  let expiry = 0;
  let busy = false;
  const occupied = () =>
    document.hidden ||
    document.documentElement.classList.contains("overlay-open") ||
    Boolean(document.activeElement?.closest("form"));
  const clear = () => {
    stack.replaceChildren();
    region.hidden = true;
  };
  region.querySelector(".activity-hide")!.addEventListener("click", () => {
    dismissed = true;
    write(`${key}:hidden`, "true");
    clear();
  });
  const poll = async () => {
    if (dismissed || busy || occupied() || stack.childElementCount) return;
    busy = true;
    try {
      const response = await fetch("/api/activity", {
        signal: AbortSignal.timeout(5000),
        credentials: "omit",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (dismissed || occupied()) return;
      for (const event of recentEvents(data.events).filter(
        (event) => !seen.includes(event.id),
      )) {
        const toast = template.content.firstElementChild!.cloneNode(
          true,
        ) as HTMLElement;
        toast.querySelector("small")!.textContent =
          Date.now() - event.at < 3600000
            ? "In the last hour"
            : "In the last 24 hours";
        toast.querySelector("button")!.addEventListener("click", () => {
          toast.remove();
          if (!stack.childElementCount) region.hidden = true;
        });
        stack.append(toast);
        seen.push(event.id);
      }
      if (stack.childElementCount) {
        seen = seen.slice(-100);
        write(key, JSON.stringify(seen));
        expiry = Date.now() + 12000;
        region.hidden = false;
      }
    } catch {
      // Optional social activity must never interrupt the page or invent an event.
    } finally {
      busy = false;
    }
  };
  window.setTimeout(poll, 8000);
  window.setInterval(poll, 90000);
  window.setInterval(() => {
    if (!stack.childElementCount) return;
    if (occupied() || region.matches(":hover, :focus-within"))
      expiry = Date.now() + 12000;
    else if (Date.now() >= expiry) clear();
  }, 1000);
}
