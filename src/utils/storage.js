export function getStorage(key, fallbackValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallbackValue;

  try {
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key) {
  localStorage.removeItem(key);
}

export function getSessionStorage(key, fallbackValue) {
  const raw = sessionStorage.getItem(key);
  if (!raw) return fallbackValue;

  try {
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

export function setSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}
