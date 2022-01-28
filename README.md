# Notify.Events for Homebridge

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

The integration allows sending alerts and notifications from Smart Home and IoT devices connected to Homebridge via [40+ messengers and other communication tools](https://notify.events/#sRecipients).
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

| Parameter | Required | Description                                 |
|-----------|----------|---------------------------------------------|
| name      | yes      | platform name                               |
| token     | yes      | param to specify your Notify.Events `token` |
| messages  | yes      |                                             |

### Message (accessory) configuration

| Parameter | Required | Description                                                                            |
|-----------|----------|----------------------------------------------------------------------------------------|
| name      | yes      | accessory name                                                                         |
| title     |          | message title                                                                          |
| text      | yes      | param to specify message text (allowed html tags: `<b>`, `<i>`, `<a href="">`, `<br>`) |
| priority  |          | message priority (`highest`, `high`, `normal`, `low`, `lowest`)                        |
| level     |          | message level (`verbose`, `info`, `notice`, `warning`, `error`, `success`)             |

### Example `config.json` entry:

```json
{
    "platforms": [
        {
            "platform": "NotifyEvents",
            "name": "Notify.Events",
            "token": "<my-notify-events-channel-token>",
            "messages": [
                {
                    "name": "My message",
                    "title": "My message title",
                    "text": "My message text <b>with</b> <a href='http://google.com'>HTML</a>",
                    "priority": "highest",
                    "level": "error"
                }
            ]
        }
    ]
}
```
