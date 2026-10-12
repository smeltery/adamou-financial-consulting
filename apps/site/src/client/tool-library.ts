const library = document.querySelector<HTMLElement>(".tool-library");
if (library) {
  const input = library.querySelector<HTMLInputElement>("input")!;
  const cards = Array.from(
    library.querySelectorAll<HTMLAnchorElement>(".calculator-library > a"),
  );
  const categories = Array.from(
    library.querySelectorAll<HTMLButtonElement>("[data-category][type=button]"),
  );
  const empty = library.querySelector<HTMLElement>(".library-empty")!;
  const status = library.querySelector<HTMLElement>(".library-count")!;
  let category = "";

  const filter = () => {
    const words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of cards) {
      const text = card.textContent!.toLowerCase();
      card.hidden =
        Boolean(category && card.dataset.category !== category) ||
        !words.every((word) => text.includes(word));
      if (!card.hidden) count++;
    }
    for (const button of categories)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === category),
      );
    status.textContent = `${count} ${count === 1 ? "calculator" : "calculators"} · Free to use`;
    empty.hidden = count > 0;
  };
  for (const button of categories)
    button.addEventListener("click", () => {
      category = button.dataset.category!;
      filter();
    });
  input.addEventListener("input", filter);
  empty.querySelector("button")!.addEventListener("click", () => {
    category = "";
    input.value = "";
    filter();
    input.focus();
  });
  library.querySelector<HTMLElement>(".library-controls")!.hidden = false;
}
