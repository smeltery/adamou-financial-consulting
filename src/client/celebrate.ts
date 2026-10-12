import confetti from "canvas-confetti";

export function celebrate(welcome = false) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  // Confetti is decorative and must stay out of the accessibility tree.
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100";
  document.body.append(canvas);
  const fire = confetti.create(canvas, { resize: true });
  const colors = ["#204F60", "#78978E", "#E7C78C", "#ECA77B", "#FFFFFF"];

  const burst = (particleCount: number, angle: number, x: number) =>
    fire({
      particleCount,
      angle,
      spread: 85,
      startVelocity: welcome ? 45 : 55,
      gravity: 0.85,
      ticks: welcome ? 200 : 260,
      scalar: 1.15,
      origin: { x, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });

  for (let wave = 0; wave < (welcome ? 4 : 6); wave++) {
    window.setTimeout(() => {
      burst(welcome ? 60 : 70, 60, 0.05);
      const finished = burst(welcome ? 60 : 70, 120, 0.95);
      if (wave === (welcome ? 3 : 5))
        void finished?.then(() => canvas.remove());
    }, wave * 350);
  }
}

export function welcomeVisitor() {
  try {
    if (localStorage.getItem("afin:welcomed")) return;
    // Record before scheduling so navigation cannot trigger another welcome.
    localStorage.setItem("afin:welcomed", "1");
  } catch {
    console.warn(
      "Welcome animation skipped because browser storage is unavailable.",
    );
    return;
  }

  window.setTimeout(() => {
    if (
      document.visibilityState !== "visible" ||
      document.querySelector("dialog[open]")
    )
      return;
    try {
      celebrate(true);
    } catch (error) {
      console.error("Welcome animation could not start", error);
    }
  }, 700);
}
