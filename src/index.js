"use strict";

const Message = require('@notify.events/nodejs').Message;

let Service, Characteristic;

module.exports = function(homebridge) {
    Service        = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-notify-events", "NotifyEvents", NotifyEventsSwitch);
}

const NotifyEventsSwitch = class {

    constructor(log, config) {
        this.log = log;
        this.log('Notify.Events Plugin Loaded');

        this.config = config;

        /////////////////////////////////////////////

        this.name = config['name'];
        if (!this.name) {
            throw new Error('Missing name!');
        }

        this.token = config['token'];
        if (!this.token) {
            throw new Error('Missing token!');
        }

        this.title = config['title'];

        this.text = config['text'];
        if (!this.text) {
            throw new Error('Missing text!');
        }

        this.priority = config['priority'];
        if (this.priority && ![
            Message.PRIORITY_LOWEST,
            Message.PRIORITY_LOW,
            Message.PRIORITY_NORMAL,
            Message.PRIORITY_HIGH,
            Message.PRIORITY_HIGHEST,
        ].includes(this.priority)) {
            throw new Error('Invalid priority value: ' + this.priority);
        }

        this.level = config['level'];
        if (this.level && ![
            Message.LEVEL_VERBOSE,
            Message.LEVEL_INFO,
            Message.LEVEL_NOTICE,
            Message.LEVEL_WARNING,
            Message.LEVEL_ERROR,
            Message.LEVEL_SUCCESS
        ].includes(this.level)) {
            throw new Error('Invalid level value: ' . this.level);
        }

        /////////////////////////////////////////////

        this.services = {
            AccessoryInformation: new Service.AccessoryInformation(),
            Switch: new Service.Switch(this.name)
        };

        this.services.AccessoryInformation
            .setCharacteristic(Characteristic.Manufacturer, 'Notify.Events');
        this.services.AccessoryInformation
            .setCharacteristic(Characteristic.Model, 'Base');

        this.services.Switch
            .getChannelData(Characteristic.On);
        this.services.Switch
            .on("set", this.setPowerState.bind(this));
        this.services.Switch
            .setCharacteristic(Characteristic.On, false);
    }

    sendMessage() {
        let self = this;

        const message = new Message(this.text, this.title, this.priority, this.level);

        self.log('Send Notify.Events message');

        message.send(this.token)
            .then(response => {
                if (response.status !== 200) {
                    self.log('Send message error: [' + response.status + '] ' + response.statusText);
                }
            })
            .catch(error => {
                self.log(error);
            });

        this.services.Switch
            .setCharacteristic(Characteristic.On, false);
    }

    setPowerState(powerOn, callback) {
        if (powerOn) {
            this.sendMessage();
        }

        callback();
    }

    getServices() {
        return [this.services.AccessoryInformation, this.services.Switch];
    }

}
