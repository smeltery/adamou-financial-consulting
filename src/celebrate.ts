import confetti from "canvas-confetti";

export function celebrate(welcome = false) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#204F60", "#78978E", "#E7C78C", "#ECA77B", "#FFFFFF"];
  const burst = (particleCount: number, angle: number, x: number) =>
    confetti({
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
      burst(welcome ? 60 : 70, 120, 0.95);
    }, wave * 350);
  }
}

export function welcomeVisitor() {
  try {
    if (localStorage.getItem("afin:welcomed")) return;
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
