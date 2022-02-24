'use strict';

const http = require('http');
const url = require('url');
const common = require('../homebridge-ui/public/js/common');
const Message = require('@notify.events/nodejs').Message;

module.exports = (api) => {
    api.registerPlatform('homebridge-notifyevents', 'NotifyEvents', NotifyEventsPlatform);
};

class NotifyEventsPlatform {

    /**
     * @param log
     * @param config {Object}
     * @param api
     */
    constructor(log, config, api) {
        this.log = log;
        this.api = api;

        let errors = {};

        config = common.convert_from_1_1_2([config])[0];

        config = common.fill(config, common.CONFIG);
        config = common.validate(config, common.CONFIG, errors);

        this.config = config;

        this.hasErrors = Object.keys(errors).length > 0;

        if (this.hasErrors) {
            for (let field in errors) {
                this.log.error(field + ': ' + errors[field]);
            }

            return;
        }

        this.channels = [];

        if (this.config.action.enabled) {
            http.createServer(this.requestHandle.bind(this)).listen(this.config.action.port, this.config.action.listen);

            this.log.info(`Started server for actions on port '${this.config.action.port}' listening for host '${this.config.action.listen}'.`);
        }
    }

    /**
     * @param callback {CallableFunction}
     */
    accessories(callback) {
        let items = [];

        if (!this.hasErrors) {
            const { channels } = this.config;

            if (Array.isArray(channels)) {
                channels.forEach((channel, index) => {
                    channel = new NotifyEventsChannel(this, channel, index);

                    this.channels.push(channel);

                    channel.accessories(function (accessories) {
                        accessories.forEach(accessory => {
                            items.push(accessory);
                        });
                    });
                });
            }
        }

        callback(items);
    }

    requestHandle(request, response) {
        const rUrl = new url.URL(`http://${request.headers.host}${request.url}`);

        if (rUrl.pathname !== this.config.action.path) {
            response.statusCode = 404;
            response.end();

            return;
        }

        const channelIdx = rUrl.searchParams.get('channelIdx');
        const messageIdx = rUrl.searchParams.get('messageIdx');
        const actionIdx  = rUrl.searchParams.get('actionIdx');

        if ((channelIdx === null) || (messageIdx === null) || (actionIdx === null)) {
            response.statusCode = 404;
            response.end();

            return;
        }

        try {
            this.actionFire(channelIdx, messageIdx, actionIdx);
        } catch (e) {
            this.log.error(e.message);

            response.statusCode = 500;
            response.end();

            return;
        }

        response.statusCode = 200;
        response.end();
    }

    actionFire(channelIdx, messageIdx, actionIdx) {
        this.channels[channelIdx].actionFire(messageIdx, actionIdx);
    }

}

class NotifyEventsChannel {

    /**
     * @param platform {NotifyEventsPlatform}
     * @param config {Object}
     * @param index {number}
     */
    constructor(platform, config, index) {
        this.platform = platform;
        this.config = config;
        this.index = index;

        this.log = this.platform.log;
        this.api = this.platform.api;

        this.messages = [];
    }

    /**
     * @param callback {CallableFunction}
     */
    accessories(callback) {
        let items = [];

        const { messages } = this.config;

        if (Array.isArray(messages)) {
            messages.forEach((message, index) => {
                message = new NotifyEventsMessage(this, message, index);

                this.messages.push(message);
                items.push(message);

                message.accessories(function (accessories) {
                    accessories.forEach(accessory => {
                        items.push(accessory);
                    });
                });
            });
        }

        callback(items);
    }

    /**
     * @param messageIdx {number}
     * @param actionIdx {number}
     */
    actionFire(messageIdx, actionIdx) {
        this.messages[messageIdx].actionFire(actionIdx);
    }

    /**
     * @param message {Message}
     */
    sendMessage(message) {
        message.send(this.config.token)
            .catch(function (error) {
                this.log.error('Error: Send message fail with message "' + error.message + '"');
            }.bind(this));
    }

}

class NotifyEventsMessage {

    /**
     * @param channel {NotifyEventsChannel}
     * @param config {Object}
     * @param index {number}
     */
    constructor(channel, config, index) {
        this.channel = channel;
        this.config = config;
        this.index = index;

        this.log = this.channel.log;
        this.api = this.channel.api;

        this.name = this.config.name;

        this.actions = [];

        this.value = false;

        this.informationService = new this.api.hap.Service.AccessoryInformation()
            .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Notify.Events')
            .setCharacteristic(this.api.hap.Characteristic.Model, 'Message');

        this.switchService = new this.api.hap.Service.Switch(this.name);

        this.switchService.getCharacteristic(this.api.hap.Characteristic.On)
            .onGet(this.getOnHandler.bind(this))
            .onSet(this.setOnHandler.bind(this));
    }

    /**
     * @param callback {CallableFunction}
     */
    accessories(callback) {
        let items = [];

        if (this.channel.platform.config.action.enabled) {
            const { actions } = this.config;

            if (Array.isArray(actions)) {
                actions.forEach((action, index) => {
                    action = new NotifyEventsMessageAction(this, action, index);

                    this.actions.push(action);
                    items.push(action);
                });
            }
        }

        callback(items);
    }

    /**
     * @return {*[]}
     */
    getServices() {
        return [this.informationService, this.switchService];
    }

    /**
     * @param actionIdx {number}
     */
    actionFire(actionIdx) {
        this.actions[actionIdx].actionFire();
    }

    /**
     *
     */
    sendMessage() {
        this.log.info('[' + this.config.name + '] Send message');

        const message = new Message(this.config.text, this.config.title, this.config.priority, this.config.level);

        const actionConfig = this.channel.platform.config.action;

        const rUrl = new URL(`http://${actionConfig.host}:${actionConfig.port}${actionConfig.path}`);

        rUrl.searchParams.set('channelIdx', this.channel.index);
        rUrl.searchParams.set('messageIdx', this.index);

        this.actions.forEach(action => {
            rUrl.searchParams.set('actionIdx', action.index);

            try {
                message.addAction(action.config.name, action.config.title, rUrl.href);
            } catch (e) {
                this.log.error(e.message);
            }
        });

        this.channel.sendMessage(message);
    }

    /**
     * @return {Promise<boolean>}
     */
    async getOnHandler() {
        return this.value;
    }

    /**
     * @param value {boolean}
     * @return {Promise<void>}
     */
    async setOnHandler(value) {
        this.value = value;

        if (this.value) {
            this.sendMessage();

            setTimeout(function() {
                this.value = false;

                this.switchService.getCharacteristic(this.api.hap.Characteristic.On).updateValue(false);
            }.bind(this), 1000);
        }
    }

}

class NotifyEventsMessageAction {

    /**
     * @param message {NotifyEventsMessage}
     * @param config {Object}
     * @param index {number}
     */
    constructor(message, config, index) {
        this.message = message;
        this.config = config;
        this.index = index;

        this.log = this.message.log;
        this.api = this.message.api;

        this.name = this.config.name;

        this.value = false;

        this.informationService = new this.api.hap.Service.AccessoryInformation()
            .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Notify.Events')
            .setCharacteristic(this.api.hap.Characteristic.Model, 'MessageAction');

        this.switchService = new this.api.hap.Service.Switch(this.name);

        this.switchService.getCharacteristic(this.api.hap.Characteristic.On)
            .onGet(this.getOnHandler.bind(this))
            .onSet(this.setOnHandler.bind(this));
    }

    /**
     * @return {*[]}
     */
    getServices() {
        return [this.informationService, this.switchService];
    }

    /**
     *
     */
    actionFire() {
        this.switchService.getCharacteristic(this.api.hap.Characteristic.On).updateValue(true);

        this.setOnHandler(true);
    }

    /**
     * @return {Promise<boolean>}
     */
    async getOnHandler() {
        return this.value;
    }

    /**
     * @param value {boolean}
     * @return {Promise<void>}
     */
    async setOnHandler(value) {
        this.value = value;

        if (this.value) {
            setTimeout(function() {
                this.value = false;

                this.switchService.getCharacteristic(this.api.hap.Characteristic.On).updateValue(false);
            }.bind(this), 1000);
        }
    }

}
