export function setupSearch() {
  const shortcut = document.querySelector(".search-trigger kbd");
  if (shortcut && !/Mac|iPhone|iPad/.test(navigator.platform))
    shortcut.textContent = "Ctrl K";
  const dialog = document.querySelector<HTMLDialogElement>("#site-search")!;
  const input = dialog.querySelector<HTMLInputElement>("input")!;
  const links = [
    ...dialog.querySelectorAll<HTMLAnchorElement>(".search-results a"),
  ];
  const status = dialog.querySelector<HTMLElement>("[role=status]")!;
  let previousFocus: HTMLElement | null = null;
  const filter = () => {
    const words = input.value.toLowerCase().trim().split(/\s+/);
    links.forEach((link) => {
      link.hidden = !words.every((word) =>
        `${link.textContent} ${link.dataset.keywords}`
          .toLowerCase()
          .includes(word),
      );
    });
    const count = links.filter((link) => !link.hidden).length;
    status.textContent = count
      ? `${count} ${count === 1 ? "result" : "results"}. Use arrow keys to browse, Enter to open.`
      : "No matches. Try budgeting, savings, or contact.";
  };
  const open = () => {
    if (dialog.open) {
      dialog.close();
      return;
    }
    previousFocus = document.activeElement as HTMLElement;
    document
      .querySelector<HTMLDetailsElement>(".mobile-menu")
      ?.removeAttribute("open");
    input.value = "";
    filter();
    dialog.showModal();
    input.focus();
  };
  document
    .querySelectorAll<HTMLButtonElement>("[data-search]")
    .forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", () => {
        open();
        previousFocus = button;
      });
    });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  });
  input.addEventListener("input", filter);
  dialog
    .querySelector("[data-close]")!
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () =>
    previousFocus?.focus({ preventScroll: true }),
  );
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    }
  });
  links.forEach((link) => link.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
      return;
    }
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
    visible[
      (start + (event.key === "ArrowDown" ? 1 : -1) + visible.length) %
        visible.length
    ].focus();
  });
}
