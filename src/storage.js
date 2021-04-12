export let storage = {
  get: async function (key) {
    return (await browser.storage.sync.get(key))[key];
  },
  save: async function (key, value) {
    browser.storage.sync.set({ [key]: value });
  },
};

