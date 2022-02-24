# Notify.Events for Homebridge

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![npm](https://img.shields.io/npm/v/homebridge-notifyevents)
![npm](https://img.shields.io/npm/dw/homebridge-notifyevents)

This integration allows sending alerts and notifications from Smart Home and IoT devices connected to Homebridge via [40+ messengers and other communication tools](https://notify.events/#sRecipients).

Receive instant messages via Signal, Telegram, Discord, Signal., SMS, push, voice calls and more. Apply simple text formatting, level and priority to alerts, and filter by time to direct them to the desired family member.

See the full list of supported messengers [here](https://notify.events/features).

#### Read the manual in other languages

- [Русский](docs/ru-RU/README.md)

## Notify.Events configuration

1. Sign-up to the [Notify.Events](https://notify.events/user/sign-in) service.
2. Create a new channel.
3. Add [Homebridge source](https://notify.events/source/homebridge) to your channel.
4. Copy your token and save the integration.

## Installation

Before installing this plugin, you should install Homebridge using the [official instructions](https://github.com/homebridge/homebridge/wiki).

### Installation via Homebridge Config UI X

1. Search for `Notify.Events` on the Plugins tag of [Config UI X](https://www.npmjs.com/package/homebridge-config-ui-x).
2. Install the `Notify.Events` plugin and use the form to enter your accessory configurations.

### Manual installation

1. Install this plugin using: `sudo npm install -g homebridge-notifyevents`.
2. Edit `config.json` manually to add your notification. See below for instructions on that.

## Configuration

### Platform configuration

| Parameter | Required | Description                                                   |
|-----------|----------|---------------------------------------------------------------|
| action    | yes      | [Action handler configuration](#Action-handler-configuration) |
| channels  | yes      | [Channel list](#Channel-configuration)                        |

### Action handler configuration

All described Actions are becoming the buttons you will see under the notification message to take an action right from the chat.

After you pushing one of those buttons, Notify.Events will trigger an Action accessory in your Homebridge, which you can use as a trigger for your automations.

In order for Notify.Events to interact with Homebridge, you need to enable action support and set up a handler:

| Parameter | Required         | Description                                                                           |
|-----------|------------------|---------------------------------------------------------------------------------------|
| enabled   |                  | Enable Actions                                                                        |
| listen    | yes (if enabled) | Listen host (To listen to all interfaces you can use "0.0.0.0" (IPv4) or "::" (IPv6)) |
| port      | yes (if enabled) | Listen port                                                                           |
| host      | yes (if enabled) | Your external host                                                                    |
| path      | yes (if enabled) | Action target path                                                                    |

**Notice**: Don't forget to make sure that your Homebridge instance is reachable from the web.

### Channel configuration

| Parameter | Required | Description                                                 |
|-----------|----------|-------------------------------------------------------------|
| title     | yes      | Channel name                                                |
| token     | yes      | [Notify.Events channel token](#Notify.Events-configuration) |
| messages  | yes      | [Message list](#Message-(accessory)-configuration)          |

### Message (accessory) configuration

| Parameter | Required | Description                                                                |
|-----------|----------|----------------------------------------------------------------------------|
| name      | yes      | Accessory name                                                             |
| title     |          | Message title                                                              |
| text      | yes      | Message text (allowed html-tags: `<b>`, `<i>`, `<a href="">`, `<br>`)      |
| priority  |          | Message priority (`highest`, `high`, `normal`, `low`, `lowest`)            |
| level     |          | Message level (`verbose`, `info`, `notice`, `warning`, `error`, `success`) |
| actions   |          | [Action list](#Action-(accessory)-configuration)                           |

### Action (accessory) configuration

| Parameter | Required | Description           |
|-----------|----------|-----------------------|
| name      | yes      | Accessory name        |
| title     | yes      | Action (button) title |

### Example `config.json` entry:

```json
{
    "platforms": [
        {
            "platform": "NotifyEvents",
            "action": {
                "enabled": true,
                "listen": "0.0.0.0",
                "port": 53535,
                "host": "<your-homebridge-host>",
                "path": "/"
            },
            "channels": [
                {
                    "title": "My Channel",
                    "token": "<your-notifyevents-token>",
                    "messages": [
                        {
                            "name": "My Message",
                            "title": "My Message Title",
                            "text": "Hello <b>Dolly</b>",
                            "priority": "normal",
                            "level": "info",
                            "actions": [
                                {
                                    "name": "My Action",
                                    "title": "Click Me"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```
