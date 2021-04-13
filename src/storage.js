export let storage = {
  async get(key) {
    return (await browser.storage.sync.get(key))[key];
  },
  save(key, value) {
    return browser.storage.sync.set({ [key]: value });
  },
};

