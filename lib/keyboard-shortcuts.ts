export const GLOBAL_SHORTCUTS = [
  { key: '/', description: 'Focus search', keys: ['slash'] },
  { key: 'N', description: 'New request', keys: ['n'] },
  { key: 'G D', description: 'Go to Dashboard', keys: ['g', 'd'] },
  { key: 'G P', description: 'Go to Projects', keys: ['g', 'p'] },
  { key: 'G R', description: 'Go to Requests', keys: ['g', 'r'] },
  { key: 'G T', description: 'Go to Tasks', keys: ['g', 't'] },
  { key: '?', description: 'Show keyboard shortcuts', keys: ['shift', '?'] },
];

export const REQUEST_SHORTCUTS = [
  { key: 'A', description: 'Approve request', keys: ['a'] },
  { key: 'R', description: 'Reject request', keys: ['r'] },
  { key: 'E', description: 'Edit', keys: ['e'] },
  { key: 'C', description: 'Add comment', keys: ['c'] },
  { key: 'Esc', description: 'Close modal', keys: ['escape'] },
];

export type ShortcutConfig = {
  key: string;
  description: string;
  keys: string[];
  action?: () => void;
};

export function setupKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = (e: KeyboardEvent) => {
    const keysPressed = [];
    if (e.ctrlKey || e.metaKey) keysPressed.push('ctrl');
    if (e.shiftKey) keysPressed.push('shift');
    if (e.altKey) keysPressed.push('alt');
    
    const key = e.key.toLowerCase();
    if (key === '/') keysPressed.push('slash');
    else if (key === '?') keysPressed.push('?');
    else if (key === 'escape') keysPressed.push('escape');
    else if (key.length === 1) keysPressed.push(key);
    
    shortcuts.forEach((shortcut) => {
      if (arraysEqual(keysPressed, shortcut.keys)) {
        e.preventDefault();
        shortcut.action?.();
      }
    });
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}
