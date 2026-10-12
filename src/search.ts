export function setupSearch() {
  const search = document.querySelector<HTMLDialogElement>("#site-search")!;
  const menu = document.querySelector<HTMLDialogElement>("#mobile-navigation")!;
  const input = search.querySelector<HTMLInputElement>("input")!;
  const links = [
    ...search.querySelectorAll<HTMLAnchorElement>(".search-results a"),
  ];
  const scopes = [
    ...search.querySelectorAll<HTMLButtonElement>("[data-scope]"),
  ];
  const status = search.querySelector<HTMLElement>("[role=status]")!;
  let scope = "all",
    scrollPosition = 0;
  let returnFocus: HTMLElement | null = null;
  let closing: Animation | null = null;
  const close = (dialog: HTMLDialogElement, immediate = false) => {
    if (
      dialog === menu &&
      !immediate &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      if (closing) return;
      closing = menu.animate(
        { transform: [getComputedStyle(menu).transform, "translateX(100%)"] },
        { duration: 240, easing: "ease-in", fill: "forwards" },
      );
      closing.onfinish = () => close(menu, true);
      return;
    }
    closing?.cancel();
    closing = null;
    dialog.close();
    document.body.style.top = "";
    document.documentElement.classList.remove("overlay-open");
    window.scrollTo({ top: scrollPosition, behavior: "instant" });
    returnFocus?.focus({ preventScroll: true });
  };
  const show = (dialog: HTMLDialogElement, trigger: HTMLElement | null) => {
    const current = document.querySelector<HTMLDialogElement>("dialog[open]");
    if (current) close(current, true);
    scrollPosition = window.scrollY;
    returnFocus = trigger;
    document.body.style.top = `-${scrollPosition}px`;
    document.documentElement.classList.add("overlay-open");
    dialog.showModal();
  };
  const filter = () => {
    const words = input.value.toLowerCase().trim().split(/\s+/);
    links.forEach((link) => {
      const group = link.closest<HTMLElement>("[data-group]")!.dataset.group;
      link.hidden =
        (scope !== "all" && scope !== group) ||
        !words.every((word) => link.textContent!.toLowerCase().includes(word));
    });
    search.querySelectorAll<HTMLElement>("[data-group]").forEach((group) => {
      group.hidden = ![...group.querySelectorAll<HTMLAnchorElement>("a")].some(
        (link) => !link.hidden,
      );
    });
    scopes.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.scope === scope),
      ),
    );
    const count = links.filter((link) => !link.hidden).length;
    status.textContent = `${count} ${count === 1 ? "result" : "results"}`;
    search.querySelector<HTMLElement>(".search-empty")!.hidden = count > 0;
    search.querySelector(".search-scroll")!.scrollTop = 0;
  };
  const openSearch = (trigger: HTMLElement | null, selectedScope = "all") => {
    scope = selectedScope;
    input.value = "";
    filter();
    show(search, trigger);
    input.focus();
  };
  const shortcut = document.querySelector(".search-trigger kbd");
  if (shortcut && !/Mac|iPhone|iPad/.test(navigator.platform))
    shortcut.textContent = "Ctrl K";
  document
    .querySelectorAll<HTMLButtonElement>("[data-search]")
    .forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", () =>
        openSearch(button, button.dataset.search || "all"),
      );
    });
  const menuTrigger = document.querySelector<HTMLButtonElement>(
    ".mobile-menu-trigger",
  )!;
  menuTrigger.hidden = false;
  menuTrigger.addEventListener("click", () => show(menu, menuTrigger));
  matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches && menu.open) close(menu);
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (search.open) close(search);
      else openSearch(document.activeElement as HTMLElement);
    }
  });
  input.addEventListener("input", filter);
  scopes.forEach((button) =>
    button.addEventListener("click", () => {
      scope = button.dataset.scope!;
      filter();
      input.focus();
    }),
  );
  [search, menu].forEach((dialog) => {
    dialog
      .querySelector("[data-close]")!
      .addEventListener("click", () => close(dialog));
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      close(dialog);
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(dialog);
      }
    });
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      )
        close(dialog);
    });
    dialog
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", () => close(dialog)));
  });
  search.addEventListener("keydown", (event) => {
    const visible = links.filter((link) => !link.hidden);
    if (event.key === "Enter" && event.target === input) {
      event.preventDefault();
      visible[0]?.click();
    }
    if (!["ArrowDown", "ArrowUp"].includes(event.key) || !visible.length)
      return;
    event.preventDefault();
    const index = visible.indexOf(document.activeElement as HTMLAnchorElement);
    const start = index < 0 && event.key === "ArrowUp" ? 0 : index;
    const next =
      visible[
        (start + (event.key === "ArrowDown" ? 1 : -1) + visible.length) %
          visible.length
      ];
    next.focus({ preventScroll: true });
    next.scrollIntoView({ block: "nearest", behavior: "instant" });
  });
}
