export function createConfetti(elementOrCoords?: HTMLElement | { x: number; y: number }, duration = 2000) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  if (elementOrCoords) {
    if (elementOrCoords instanceof HTMLElement) {
      const rect = elementOrCoords.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else {
      x = elementOrCoords.x;
      y = elementOrCoords.y;
    }
  }

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const angle = (Math.random() * Math.PI * 2);
    const velocity = 3 + Math.random() * 7;
    const tx = Math.cos(angle) * velocity * 100;
    const ty = Math.sin(angle) * velocity * 100 - 50;

    confetti.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      --tx: ${tx}px;
      --ty: ${ty}px;
      z-index: 9999;
    `;
    confetti.className = 'confetti-piece';
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), duration);
  }
}

export function createCheckmark(element: HTMLElement, callback?: () => void) {
  const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  checkmark.setAttribute('viewBox', '0 0 50 50');
  checkmark.setAttribute('width', '50');
  checkmark.setAttribute('height', '50');
  checkmark.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  `;

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '25');
  circle.setAttribute('cy', '25');
  circle.setAttribute('r', '23');
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', '#10B981');
  circle.setAttribute('stroke-width', '2');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M15 25 L22 32 L35 18');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#10B981');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.className.baseVal = 'checkmark-draw';

  checkmark.appendChild(circle);
  checkmark.appendChild(path);
  element.appendChild(checkmark);

  setTimeout(() => {
    checkmark.remove();
    callback?.();
  }, 600);
}

export function createSuccessAnimation(element: HTMLElement, message = 'Success!') {
  const originalBg = element.style.backgroundColor;
  element.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
  element.textContent = message;

  setTimeout(() => {
    element.style.backgroundColor = originalBg;
  }, 2000);
}
