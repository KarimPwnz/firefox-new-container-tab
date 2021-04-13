// Listeners

browser.runtime.onMessage.addListener(handleRequest); // listen for messages from scripts

// Handlers

async function handleRequest(request) {
  switch (request.type) {
    case "send-containers":
      popup.sendContainers();
      break;
    case "open-container-tab":
      tab.newWithContainer(request.content);
      break;
  }
}

// Popup

let popup = {
  send(request) {
    return browser.runtime.sendMessage(request);
  },
  async sendContainers () {
    let allContainers = await containers.getAll();
    this.send({ type: "containers-list", content: allContainers });
  },
};

// Tab

let tab = {
  newWithContainer (cookieStoreId) {
    return browser.tabs.create({
      cookieStoreId: cookieStoreId,
    });
  },
};

// Containers

let containers = {
  async getAll() {
    let containersObj = await browser.contextualIdentities.query({});
    return this._parseBrowserObj(containersObj);
  },
  _parseBrowserObj(containersObj) {
    let containersParsed = {};
    for (let container of containersObj) {
      containersParsed[container.name] = container.cookieStoreId;
    }
    return containersParsed;
  },
};
