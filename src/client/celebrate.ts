import confetti from "canvas-confetti";

export function celebrate() {
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
      startVelocity: 55,
      gravity: 0.85,
      ticks: 260,
      scalar: 1.15,
      origin: { x, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });

  for (let wave = 0; wave < 6; wave++) {
    window.setTimeout(() => {
      burst(70, 60, 0.05);
      const finished = burst(70, 120, 0.95);
      if (wave === 5) void finished?.then(() => canvas.remove());
    }, wave * 350);
  }
}
