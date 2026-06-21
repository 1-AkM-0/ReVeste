const getLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const getStorage = (key, fallback = null) => {
  try {
    const value = getLocalStorage()?.getItem(key);

    return value === null || value === undefined ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const setStorage = (key, value) => {
  try {
    const storage = getLocalStorage();

    if (!storage) {
      return false;
    }

    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeStorage = (key) => {
  try {
    const storage = getLocalStorage();

    if (!storage) {
      return false;
    }

    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
