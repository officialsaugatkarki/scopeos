export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  
  return Array.from(container.querySelectorAll(selector));
}

export function createAriaLabel(text: string, additionalInfo?: string): string {
  return additionalInfo ? `${text}. ${additionalInfo}` : text;
}

export function focusFirstElement(container: HTMLElement) {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    (elements[0] as HTMLElement).focus();
  }
}

export function setAriaPressed(element: HTMLElement, pressed: boolean) {
  element.setAttribute('aria-pressed', String(pressed));
}

export function setAriaExpanded(element: HTMLElement, expanded: boolean) {
  element.setAttribute('aria-expanded', String(expanded));
}

export function setAriaDisabled(element: HTMLElement, disabled: boolean) {
  element.setAttribute('aria-disabled', String(disabled));
  if (disabled) {
    element.setAttribute('tabindex', '-1');
  } else {
    element.removeAttribute('tabindex');
  }
}
