export let storage = {
  get: async function (key) {
    return (await browser.storage.sync.get(key))[key];
  },
  save: function (key, value) {
    return browser.storage.sync.set({ [key]: value });
  },
};

