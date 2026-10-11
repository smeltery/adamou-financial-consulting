import confetti from "canvas-confetti";

export function celebrate() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#204F60", "#78978E", "#E7C78C", "#ECA77B", "#FFFFFF"];
  const burst = (particleCount: number, angle: number, x: number) =>
    confetti({
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
      burst(70, 120, 0.95);
    }, wave * 350);
  }
}
