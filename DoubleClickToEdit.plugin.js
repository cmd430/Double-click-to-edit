//META{"name":"DoubleClickToEdit","displayName":"DoubleClickToEdit","website":"https://github.com/Farcrada/Double-click-to-edit","source":"https://github.com/Farcrada/Double-click-to-edit/blob/master/DoubleClickToEdit.plugin.js"}*//

class DoubleClickToEdit {
    getName() { return "Double click to edit"; }
    getDescription() { return "Double click messages to edit them."; }
    getVersion() { return "9.0.2"; }
    getAuthor() { return "cmd430, forked from Farcrada"; }

    start() {
        let libraryScript = document.getElementById("ZLibraryScript");
        if (!libraryScript || !window.ZLibrary) {
            if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
            libraryScript = document.createElement("script");
            libraryScript.setAttribute("type", "text/javascript");
            libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
            libraryScript.setAttribute("id", "ZLibraryScript");
            document.head.appendChild(libraryScript);
        }

        if (window.ZLibrary) this.initialize();

        try {
            document.addEventListener('dblclick', this.handler);
        }
        catch(err) {
            console.error(this.getName(), "fatal error, plugin could not be started!", err);

            try {
                this.stop();
            }
            catch(err) {
                console.error(this.getName() + ".stop()", err);
            }
        }
    }

    initialize() {
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/Farcrada/Double-click-to-edit/master/DoubleClickToEdit.plugin.js");
    }

    stop() {
        document.removeEventListener('dblclick', this.handler);
    }

    handler(e) {
        let messagediv = e.target.closest('[class^=message]');

        if (!messagediv || !messagediv.classList.contains('da-zalgo'))
            return;

        let instance = messagediv[Object.keys(messagediv).find(key => key.startsWith("__reactInternal"))];
        let message = instance && findValue(instance, "message");

        if (!message)
            return;

        if (message.author.id !== BdApi.findModuleByProps("getCurrentUser").getCurrentUser().id)
            return;

        BdApi.findModuleByProps("receiveMessage", "editMessage").startEditMessage(message.channel_id, message.id, message.content);

        function findValue (instance, searchkey) {
            var whitelist = {
                memoizedProps: true,
                child: true,
                sibling: true
            };
            var blacklist = {
                contextSection: true
            };

            return getKey(instance);

            function getKey(instance) {
                var result = undefined;
                if (instance && !Node.prototype.isPrototypeOf(instance)) {
                    let keys = Object.getOwnPropertyNames(instance);
                    for (let i = 0; result === undefined && i < keys.length; i++) {
                        let key = keys[i];

                        if (key && !blacklist[key]) {
                            var value = instance[key];

                            if (searchkey === key)
                                result = value;

                            else if ((typeof value === "object" || typeof value === "function") &&
                                    (whitelist[key] || key[0] == "." || !isNaN(key[0])))
                                result = getKey(value);
                        }
                    }
                }
                return result;
            }
        }
    }
}
