'use strict';

const Message = require('@notify.events/nodejs').Message;

module.exports = (api) => {
    api.registerPlatform('homebridge-notifyevents', 'NotifyEvents', NotifyEventsPlatform);
};

class NotifyEventsPlatform {

    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;

        if (!this.config.name) {
            this.log.error('Error: Missing platform name!');
            return;
        }

        if (!this.config.token) {
            this.log.error('Error: Missing platform token!');
            return;
        }

        if (!this.config.messages) {
            this.log.error('Error: Missing platform messages!');
            return;
        }
    }

    sendMessage(message) {
        message.send(this.config.token);
    }

    accessories(callback) {
        let items = [];

        const { messages } = this.config;

        if (Array.isArray(messages)) {
            messages.forEach(message => {
                try {
                    items.push(new NotifyEventsAccessory(this, message));
                } catch (e) {
                    this.log.error(e.message);
                }
            });
        }

        callback(items);
    }

}

class NotifyEventsAccessory {

    constructor(platform, config) {
        this.platform = platform;
        this.config = config;

        this.log = this.platform.log;
        this.api = this.platform.api;

        if (!this.config.name) {
            throw new Error('Error: Missing message name!');
        }

        if (!this.config.text) {
            throw new Error('Error: Missing message text!');
        }

        if (this.config.priority && ![
            Message.PRIORITY_LOWEST,
            Message.PRIORITY_LOW,
            Message.PRIORITY_NORMAL,
            Message.PRIORITY_HIGH,
            Message.PRIORITY_HIGHEST,
        ].includes(this.config.priority)) {
            throw new Error('Error: Invalid message priority value: ' + this.config.priority);
        }

        if (this.config.level && ![
            Message.LEVEL_VERBOSE,
            Message.LEVEL_INFO,
            Message.LEVEL_NOTICE,
            Message.LEVEL_WARNING,
            Message.LEVEL_ERROR,
            Message.LEVEL_SUCCESS,
        ].includes(this.config.level)) {
            throw new Error('Error: Invalid message level value: ' + this.config.level);
        }

        this.name = this.config.name;

        this.informationService = new this.api.hap.Service.AccessoryInformation()
            .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Notify.Events')
            .setCharacteristic(this.api.hap.Characteristic.Model, 'Message');

        this.switchService = new this.api.hap.Service.Switch(this.name);

        this.switchService.getCharacteristic(this.api.hap.Characteristic.On)
            .onGet(this.getOnHandler.bind(this))
            .onSet(this.setOnHandler.bind(this));
    }

    sendMessage() {
        this.log.info('[' + this.name + '] Send message');

        const message = new Message(this.config.text, this.config.title, this.config.priority, this.config.level);

        this.platform.sendMessage(message);
    }

    async getOnHandler() {
        return false;
    }

    async setOnHandler(value) {
        if (value) {
            this.sendMessage();
        }
    }

    getServices() {
        return [this.informationService, this.switchService];
    }
}

