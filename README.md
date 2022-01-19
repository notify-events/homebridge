# Notify.Events for Homebridge

The integration allows sending alerts and notifications from Smart Home and IoT devices connected to Homebridge via [40+ messengers and other communication tools](https://notify.events/#sRecipients).
Receive instant messages via Signal, Telegram, Discord, SMS, push, voice calls and more. Apply simple text formatting, level and priority to alerts, and filter by time to direct them to the desired family member.
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

1. Install this plugin using: `sudo npm install -g @notify.events/homebridge`.
2. Edit `config.json` manually to add your notification. See below for instructions on that.

## Configuration

| Parameter | Required | Description                                 |
|-----------|----------|---------------------------------------------|
| token     | yes      | param to specify your Notify.Events `token` |
| text      | yes      | param to specify message text (allowed html tags: `<b>`, `<i>`, `<a href="">`, `<br>`) |
| title     |          | message title                               |
| priority  |          | message priority (`highest`, `high`, `normal`, `low`, `lowest`) |
| level     |          | message level (`verbose`, `info`, `notice`, `warning`, `error`, `success`) |

Example `config.json` entry:

```json
"accessories": [
  {
    "accessory": "NotifyEvents",
    "name": "Flower message",
    "tokent": "<my-notify-events-channel-token>",
    "text": "I need water!"
  }
]
```
