import confetti from 'canvas-confetti';

export function handleConfetti(rect: DOMRect) {
  // Calculate normalized coordinates for confetti origin
  const originX = (rect.left + rect.width / 2) / window.innerWidth;
  const originY = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 80,
    spread: 60,
    startVelocity: 40,
    origin: { x: originX, y: originY },
    scalar: 0.8,
    ticks: 200,
  });
}
