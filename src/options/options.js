import { storage } from "../storage.js";

let optionsDOM = (function () {
  // Private properties

  let form = document.getElementById("options");
  let checkboxes = form.querySelectorAll("input[type='checkbox']");

  // Private methods

  let showSettings = async () => {
    for (let checkbox of checkboxes) {
      checkbox.checked = Boolean(await storage.get(checkbox.id)); // also handles undefined
    }
  };

  let setListeners = () => {
    for (let checkbox of checkboxes) {
      checkbox.addEventListener("change", (e) => onchange(e));
    }
  };

  let onchange = (e) => {
    storage.save(e.target.id, e.target.checked);
  };

  // Public methods
  return {
    init: () => {
      showSettings();
      setListeners();
    }
  }
})();

optionsDOM.init();
