export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

let toastCallbacks: Array<(toast: Toast) => void> = [];
let toastId = 0;

export function subscribeToToasts(callback: (toast: Toast) => void) {
  toastCallbacks.push(callback);
  return () => {
    toastCallbacks = toastCallbacks.filter((cb) => cb !== callback);
  };
}

function createToast(message: string, type: ToastType, duration = 4000, action?: Toast['action']) {
  const id = `toast-${++toastId}`;
  const toast: Toast = { id, message, type, duration, action };
  toastCallbacks.forEach((cb) => cb(toast));
  return id;
}

export const toast = {
  success: (message: string, duration?: number) => createToast(message, 'success', duration),
  error: (message: string, duration?: number) => createToast(message, 'error', duration),
  info: (message: string, duration?: number) => createToast(message, 'info', duration),
  warning: (message: string, duration?: number) => createToast(message, 'warning', duration),
  action: (message: string, action: Toast['action'], duration?: number) =>
    createToast(message, 'info', duration, action),
};
