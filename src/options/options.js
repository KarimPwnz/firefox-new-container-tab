import { storage } from "../storage.js";

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
    for (let checkbox of this.checkboxes) {
      val = await storage.get(checkbox.id);
      if (val) checkbox.checked = val;
    }
  };

  this._setListeners = () => {
    for (let checkbox of this.checkboxes) {
      checkbox.addEventListener("change", (e) => this._onchange(e));
    }
  };

  this._onchange = (e) => {
    storage.save(e.target.id, e.target.checked);
  };
};

new optionsDOM().init();
