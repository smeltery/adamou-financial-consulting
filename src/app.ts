import { celebrate } from "./celebrate";
import { inject } from "@vercel/analytics";
if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
  inject({
    mode: "production",
    beforeSend: (event) => {
      const url = new URL(event.url);
      url.search = "";
      url.hash = "";
      return { ...event, url: url.toString() };
    },
  });
}
import { introduction, sendInquiry } from "./intake";
declare const FORMSPREE_ENDPOINT: string;
const header = document.querySelector<HTMLElement>(".site-header")!;
const headerSpace = document.querySelector<HTMLElement>(".header-space")!;
let headerHeight = header.offsetHeight;
const updateHeader = () =>
  header.classList.toggle("is-pinned", window.scrollY > headerHeight);
const measureHeader = () => {
  headerHeight = header.offsetHeight;
  headerSpace.style.height = `${headerHeight}px`;
  updateHeader();
};
new ResizeObserver(measureHeader).observe(header);
window.addEventListener("scroll", updateHeader, { passive: true });
measureHeader();
const menu = document.querySelector<HTMLDetailsElement>(".mobile-menu");
menu?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.open = false;
  }),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.open) {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }
});
const form = document.querySelector<HTMLFormElement>("#intake");
if (form) {
  const get = <T extends HTMLElement>(selector: string) =>
    document.querySelector<T>(selector)!;
  const status = get<HTMLParagraphElement>("#form-status");
  const submit = get<HTMLButtonElement>("#submit");
  const business = get<HTMLLabelElement>("#business-field");
  const clientType = form.elements.namedItem("clientType") as HTMLSelectElement;
  const phone = form.elements.namedItem("phone") as HTMLInputElement;
  const preference = form.elements.namedItem(
    "contactPreference",
  ) as HTMLSelectElement;
  const syncFields = () => {
    business.hidden = clientType.value !== "My small business";
    business.querySelector("input")!.disabled = business.hidden;
    phone.required = preference.value === "Phone";
    get("#phone-requirement").textContent = phone.required ? "*" : "(optional)";
  };
  clientType.addEventListener("change", syncFields);
  preference.addEventListener("change", syncFields);
  syncFields();
  const goal = new URLSearchParams(location.search).get("goal");
  form
    .querySelectorAll<HTMLInputElement>('[name="goals"]')
    .forEach((input) => (input.checked = input.value === goal));
  get("#delivery-note").textContent = FORMSPREE_ENDPOINT
    ? "Your inquiry will be sent to Matt through Formspree."
    : "This form prepares an email introduction. Review it, then send it from your email app.";
  if (FORMSPREE_ENDPOINT) submit.textContent = "Send my introduction";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get("_gotcha")) return;
    const draft = () => {
      const body = introduction(data);
      get<HTMLTextAreaElement>("#email-copy").value = body;
      get<HTMLAnchorElement>("#email-link").href =
        `mailto:madamou@afin-consulting.com?subject=${encodeURIComponent("Afin — a new introduction")}&body=${encodeURIComponent(body)}`;
      get("#email-fallback").hidden = false;
    };
    if (!FORMSPREE_ENDPOINT) {
      draft();
      status.textContent =
        "Your introduction is ready to review. It has not been sent yet.";
      status.focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = "Sending…";
    status.textContent = "";
    try {
      await sendInquiry(FORMSPREE_ENDPOINT, data);
      form.reset();
      syncFields();
      get("#email-fallback").hidden = true;
      status.textContent =
        "Thank you. Your inquiry was sent to Matt. He’ll follow up using your contact details.";
      try {
        celebrate();
      } catch (error) {
        console.error("Confetti could not start", error);
      }
    } catch {
      status.textContent =
        "We couldn’t confirm delivery. Your details are still here. Try again, or use the email draft below. If you already received confirmation, avoid sending twice.";
      draft();
    } finally {
      submit.disabled = false;
      submit.textContent = "Send my introduction";
      status.focus();
    }
  });
}
