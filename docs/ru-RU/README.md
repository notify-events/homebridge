# Notify.Events для Homebridge

Интеграция позволяет отправлять уведомления от умных устройств, подключенных к Homebridge в [40+ мессенджеров и другие средства связи](https://notify.events/#sRecipients).
Получайте мгновенные оповещения в Telegram, Viber, Zoom, VK, Discord, по SMS, в виде push-уведомлений и другими способами. Применяйте простое форматирование текста, назначайте уведомлениям уровень и приоритет, задавайте фильтрацию по времени, чтобы сортировать сообщения от умных устройств и направлять их нужному члену семьи.
Посмотрите полный список поддерживаемых мессенджеров [здесь](https://notify.events/features).

#### Инструкция на других языках

- [English](../../README.md)

## Notify.Events конфигурация

1. Зарегистрируйтесь в сервисе [Notify.Events](https://notify.events/user/sign-in)
2. Создайте канал
3. Добавьте [источник Homebridge](https://notify.events/source/homebridge) в ваш канал
4. Скопируйте токен и сохраните интеграцию

## Установка

Перед установкой этого плагина вам необходимо установить Homebridge используя [официальную инструкцию](https://github.com/homebridge/homebridge/wiki).

### Установка через Homebridge Config UI X

1. Введите `Notify.Events` в строку поиска плагинов в интерфейсе плагина [Config UI X](https://www.npmjs.com/package/homebridge-config-ui-x).
2. Установите `Notify.Events` плагин и используйте форму для формирования accessories.

### Ручная установка

1. Установите плагин используя команду: `sudo npm install -g @notify-events/homebridge`.
2. Измените `config.json` для добавления записи о нотификации. Посмотрите инструкцию ниже.

## Конфигурация

| Параметр | Обязателен | Описание                                 |
|----------|------------|---------------------------------------------|
| token    | да         | параметр для указания вашего Notify.Events `token` |
| text     | да         | параметр для указания текста сообщения (допустимые html теги: `<b>`, `<i>`, `<a href="">`, `<br>`) |
| title    |            | заголовок сообщения                               |
| priority |            | приоритет сообщения (`highest`, `high`, `normal`, `low`, `lowest`) |
| level    |            | уровень сообщения (`verbose`, `info`, `notice`, `warning`, `error`, `success`) |

Пример записи в `config.json`:

```json
"accessories": [
  {
    "accessory": "NotifyEvents",
    "name": "Цветок пишет",
    "tokent": "<my-notify-events-channel-token>",
    "text": "Полей меня!"
  }
]
```
