export const storage = {
  /**
   * Retrieves a value from local storage.
   */
  async get<T>(key: string, defaultValue: T): Promise<T> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          if (result && result[key] !== undefined) {
            resolve(result[key] as T);
          } else {
            resolve(defaultValue);
          }
        });
      });
    } else {
      const val = localStorage.getItem(key);
      if (val !== null) {
        try {
          return JSON.parse(val) as T;
        } catch {
          return defaultValue;
        }
      }
      return defaultValue;
    }
  },

  /**
   * Stores a value in local storage.
   */
  async set<T>(key: string, value: T): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  /**
   * Removes a specific key from local storage.
   */
  async remove(key: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], () => {
          resolve();
        });
      });
    } else {
      localStorage.removeItem(key);
    }
  },

  /**
   * Clears all local storage.
   */
  async clear(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => {
          resolve();
        });
      });
    } else {
      localStorage.clear();
    }
  },
};
export default storage;
