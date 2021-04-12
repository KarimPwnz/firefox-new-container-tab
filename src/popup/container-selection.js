import { storage } from "../storage.js";

// Listeners

browser.runtime.onMessage.addListener(handleRequest); // listen for messages from background

// Handlers

async function handleRequest(request) {
  switch (request.type) {
    case "containers-list":
      new ContainersBox(request.content).populate();
      break;
  }
}

// Background

let background = {
  send: function (request) {
    browser.runtime.sendMessage(request);
  },
};

// Containers box

class ContainersBox {
  constructor(containers) {
    this.containers = containers;
    this.dataList = document.getElementById("containers-list");
    this.input = document.getElementById("containers-input");
    this._lastVal = "";
    this._inError = false;
  }

  populate() {
    this._createOptions();
    this._setListeners();
  }

  _createOptions() {
    // Loop through containers and add each to data list as an option
    for (let container in this.containers) {
      let option = document.createElement("option");
      option.className = option.value = container;
      this.dataList.appendChild(option);
    }
  }

  _setListeners() {
    this.input.addEventListener("input", () => this._oninput());
    this.input.addEventListener("keydown", (e) => this._onkeydown(e));
  }

  async _oninput() {
    let prevVal = this._lastVal;
    this._lastVal = this.input.value;
    // Handle user backspacing (avoid forced search)
    if (this.input.value.length > prevVal.length) {
      // If not backspacing, get search result
      let searchResults = this._getSearchResults();
      // Check if only a single search result (to autocomplete)
      if (searchResults.length == 1) {
        let searchResult = searchResults[0];
        this.input.value = searchResult;
        // Check if auto-open setting enabled
        if (await storage.get("auto-open")) {
          return this._sendAndDestruct();
        }
        // Focus the suggestion (so user can remove it)
        this.input.setSelectionRange(this._lastVal.length, searchResult.length);
        this.input.focus();
      }
    }
    // Check if input invalid container
    this._checkError();
  }

  _onkeydown(e) {
    switch (e.key) {
      case "Enter":
        if (this._inError) return;
        this._sendAndDestruct();
        break;
    }
  }

  _checkError() {
    // Check if input invalid container
    if (!this.containers[this.input.value]) this._giveError();
    // Check if previous error exists, and remove it
    else if (this._inError) this._removeError();
  }

  _giveError() {
    this._inError = true;
    document.body.classList.add("error");
  }

  _removeError() {
    this._inError = false;
    document.body.classList.remove("error");
  }

  _getSearchResults() {
    return Object.keys(this.containers).filter((container) =>
      container.toLowerCase().startsWith(this.input.value.toLowerCase())
    );
  }

  async _sendAndDestruct() {
    await this._sendSelectedContainer();
    this._selfDestruct();
  }

  _selfDestruct() {
    window.close();
  }

  async _sendSelectedContainer() {
    let cookieStoreId = this.containers[this.input.value];
    background.send({
      type: "open-container-tab",
      content: cookieStoreId,
    });
  }
}

// Requests

background.send({ type: "send-containers" }); // ask for containers right away
