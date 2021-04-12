let optionsDOM = function () {
  // Properties

  this.form = document.getElementById("options");
  this.checkboxes = this.form.querySelectorAll("input[type='checkbox']");

  // Methods

  this.init = () => {
    this._showSettings();
    this._setListeners();
  };

  this._showSettings = async () => {
    let val;
    for (checkbox of this.checkboxes) {
      val = await optionsStorage.get(checkbox.id);
      if (val) checkbox.checked = val;
    }
  };

  this._setListeners = () => {
    for (checkbox of this.checkboxes) {
      checkbox.addEventListener("change", (e) => this._onchange(e));
    }
  };

  this._onchange = (e) => {
    optionsStorage.save(e.target.id, e.target.checked);
  };
};

let optionsStorage = {
  get: async function (key) {
    return (await browser.storage.sync.get(key))[key];
  },
  save: async function (key, value) {
    browser.storage.sync.set({ [key]: value });
  },
};

new optionsDOM().init();
