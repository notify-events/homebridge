(function(exports) {

    const CONFIG_DEFAULT_ACTION = {
        name: '',
        title: 'Click Me'
    };

    const CONFIG_DEFAULT_MESSAGE = {
        name: '',
        priority: 'normal',
        level: 'info',
        actions: []
    };

    const CONFIG_DEFAULT_CHANNEL = {
        title: 'My Channel',
        messages: [
            CONFIG_DEFAULT_MESSAGE
        ]
    };

    const CONFIG_DEFAULT_PLATFORM = {
        platform: 'Notify.Events',
        action: {
            enabled: false,
            listen: '0.0.0.0',
            port: 53535,
            host: '',
            path: '/'
        },
        channels: [
            CONFIG_DEFAULT_CHANNEL
        ]
    };

    const CONFIG = {
        type: 'object',
        default: CONFIG_DEFAULT_PLATFORM,
        properties: {
            platform: {
                type: 'string',
                required: true,
                default: CONFIG_DEFAULT_PLATFORM.platform
            },
            action: {
                type: 'object',
                required: false,
                properties: {
                    enabled: {
                        type: 'boolean',
                        required: false,
                        default: CONFIG_DEFAULT_PLATFORM.action.enabled
                    },
                    listen: {
                        type: 'string',
                        required: function (config) {
                            return getValue(config, 'action.enabled');
                        },
                        validate: function (value, config, errors, key) {
                            if (!getValue(config, 'action.enabled')) {
                                return value;
                            }

                            if (!isIpv4(value) && !isIpv6(value)) {
                                errors[key] = 'Invalid address';
                            }

                            return value;
                        },
                        default: CONFIG_DEFAULT_PLATFORM.action.listen
                    },
                    port: {
                        type: 'number',
                        required: function (config) {
                            return getValue(config, 'action.enabled');
                        },
                        default: CONFIG_DEFAULT_PLATFORM.action.port,
                        min: 1,
                        max: 65535
                    },
                    host: {
                        type: 'string',
                        required: function (config) {
                            return getValue(config, 'action.enabled');
                        },
                        validate: function (value, config, errors, key) {
                            if (!getValue(config, 'action.enabled')) {
                                return value;
                            }

                            if (!isHost(value)) {
                                errors[key] = 'Invalid host';
                            }

                            return value;
                        },
                        default: CONFIG_DEFAULT_PLATFORM.action.host
                    },
                    path: {
                        type: 'string',
                        required: function (config) {
                            return getValue(config, 'action.enabled');
                        },
                        default: CONFIG_DEFAULT_PLATFORM.action.path
                    }
                },
                default: CONFIG_DEFAULT_PLATFORM.action
            },
            channels: {
                type: 'array',
                required: true,
                default: [
                    CONFIG_DEFAULT_CHANNEL
                ],
                items: {
                    type: 'object',
                    default: CONFIG_DEFAULT_CHANNEL,
                    properties: {
                        title: {
                            type: 'string',
                            required: true,
                            default: CONFIG_DEFAULT_CHANNEL.title
                        },
                        token: {
                            type: 'string',
                            required: true,
                            validate: function (value, config, errors, key) {
                                const regexp = /^[a-z0-9_-]{32}$/gi;

                                if (!regexp.test(value)) {
                                    errors[key] = 'Invalid token';
                                }

                                return value;
                            },
                            default: CONFIG_DEFAULT_CHANNEL.token,
                            min: 32,
                            max: 32
                        },
                        messages: {
                            type: 'array',
                            required: true,
                            default: [
                                CONFIG_DEFAULT_MESSAGE
                            ],
                            items: {
                                type: 'object',
                                default: CONFIG_DEFAULT_MESSAGE,
                                properties: {
                                    name: {
                                        type: 'string',
                                        required: true,
                                        default: CONFIG_DEFAULT_MESSAGE.name
                                    },
                                    title: {
                                        type: 'string',
                                        required: false,
                                        default: CONFIG_DEFAULT_MESSAGE.title
                                    },
                                    text: {
                                        type: 'string',
                                        required: true,
                                        default: CONFIG_DEFAULT_MESSAGE.text
                                    },
                                    priority: {
                                        type: 'enum',
                                        required: true,
                                        default: CONFIG_DEFAULT_MESSAGE.priority,
                                        values: [
                                            'lowest',
                                            'low',
                                            'normal',
                                            'high',
                                            'highest'
                                        ]
                                    },
                                    level: {
                                        type: 'enum',
                                        required: true,
                                        default: CONFIG_DEFAULT_MESSAGE.level,
                                        values: [
                                            'verbose',
                                            'info',
                                            'notice',
                                            'warning',
                                            'error',
                                            'success'
                                        ]
                                    },
                                    actions: {
                                        type: 'array',
                                        required: false,
                                        default: [],
                                        items: {
                                            type: 'object',
                                            default: CONFIG_DEFAULT_ACTION,
                                            properties: {
                                                name: {
                                                    type: 'string',
                                                    required: true,
                                                    default: CONFIG_DEFAULT_ACTION.name
                                                },
                                                title: {
                                                    type: 'string',
                                                    required: true,
                                                    default: CONFIG_DEFAULT_ACTION.title
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const getValue = function(config, path, def = null) {
        path = path.split('.');

        if (path.every(function (key) {
            if (key in config) {
                config = config[key];

                return true;
            }

            return false;
        })) {
            return config;
        } else {
            return def;
        }
    }

    const isIpv4 = function(value) {
        const regexp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

        return regexp.test(value);
    };

    const isIpv6 = function(value) {
        const regexp = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;

        return regexp.test(value);
    };

    const isHost = function(value) {
        try {
            new URL('http://' + value + '/');
        } catch (e) {
            return false;
        }

        return true;
    };

    const isEmpty = function(value) {
        if (!value && (value !== false)) {
            return true;
        }

        if (Array.isArray(value) && !value.length) {
            return true;
        }

        if ((typeof(value) === 'string') && !value.trim().length) {
            return true;
        }

        return false;
    };

    const convert_from_1_1_2 = function(platforms) {
        if (!platforms.length || !('token' in platforms[0])) {
            return platforms;
        }

        let result = {
            'platform': 'NotifyEvents',
            'channels': []
        };

        platforms.forEach((platform) => {
            let channel = {
                'title': platform.name,
                'token': platform.token,
                'messages': []
            };

            if ('messages' in platform) {
                platform.messages.forEach((platformMessage) => {
                    let message = {
                        'name':     platformMessage.name,
                        'title':    platformMessage.title,
                        'text':     platformMessage.text,
                        'priority': platformMessage.priority,
                        'level':    platformMessage.level
                    };

                    channel.messages.push(message);
                });
            }

            result.channels.push(channel);
        });

        return [result];
    };

    const fill = function(value, config, key = 'platform') {
        if (value === undefined) {
            value = config.default;
        }

        switch (config.type) {
            case 'object': {
                if (typeof(value) !== 'object') {
                    value = config.default;
                }

                let object = {};

                for (let field in config.properties) {
                    object[field] = fill(value[field], config.properties[field], key + '.' + field);
                }

                value = object;
            } break;
            case 'array': {
                if (!Array.isArray(value)) {
                    value = config.default;
                }

                let array = [];

                for (let index in value) {
                    array.push(fill(value[index], config.items, key + '.' + index));
                }

                value = array;
            } break;
        }

        return value;
    };

    const validate = function(value, config, errors, key = 'platform', initialValue = null) {
        if (initialValue === null) {
            initialValue = value;
        }

        let isRequired = ('required' in config) && config.required;

        if (isRequired && (typeof(config.required) === 'function')) {
            isRequired = config.required(initialValue);
        }

        if (isRequired && isEmpty(value)) {
            errors[key] = 'Value is required';
        }

        switch (config.type) {
            case 'undefined': {
                // Nothing do
            } break;
            case 'string': {
                if (!(key in errors) && (typeof(value) !== 'string')) {
                    if (!isRequired) {
                        break;
                    }

                    errors[key] = 'Value must be a string';
                }

                if (!(key in errors) && ('min' in config) && (config.min > value.length)) {
                    errors[key] = 'Value length should not be less than: ' + config.min;
                }

                if (!(key in errors) && ('max' in config) && (config.max < value.length)) {
                    errors[key] = 'Value length should not be more than: ' + config.max;
                }
            } break;
            case 'number': {
                if (!(key in errors) && (typeof(value) !== 'number')) {
                    if (!isRequired) {
                        break;
                    }

                    errors[key] = 'Value must be a number';
                }

                if (!(key in errors) && ('min' in config) && config.min > value) {
                    errors[key] = 'Value must not be less than: ' + config.min;
                }

                if (!(key in errors) && ('max' in config) && config.max < value) {
                    errors[key] = 'Value must not be greater than: ' + config.max;
                }
            } break;
            case 'boolean': {
                if (typeof(value) !== 'boolean') {
                    if (!isRequired) {
                        break;
                    }

                    errors[key] = 'Value must be a boolean';
                }
            } break;
            case 'enum': {
                if (typeof(value) !== 'string') {
                    if (!isRequired) {
                        break;
                    }

                    errors[key] = 'Value must be a string';

                    break;
                }

                if (!config.values.includes(value)) {
                    errors[key] = 'Invalid value';

                    break;
                }
            } break;
            case 'object': {
                if (typeof(value) !== 'object') {
                    if (!isRequired) {
                        break;
                    }

                    errors[key] = 'Value must be an object';

                    break;
                }

                let object = {};

                for (let field in config.properties) {
                    object[field] = validate(value[field], config.properties[field], errors, key + '.' + field, initialValue);
                }

                value = object;
            } break;
            case 'array': {
                if (!Array.isArray(value)) {
                    if (!isRequired) {
                        break;
                    }

                    errors[key] = 'Value must be an array';

                    break;
                }

                let array = [];

                for (let index in value) {
                    array.push(validate(value[index], config.items, errors, key + '.' + index, initialValue));
                }

                value = array;
            } break;
            default: {
                throw new Error('Unknown type: ' + config.type);
            }
        }

        if (('validate' in config) && !(key in errors)) {
            value = config.validate(value, initialValue, errors, key);
        }

        return value;
    };

    exports.CONFIG = CONFIG;
    exports.CONFIG_DEFAULT_PLATFORM = CONFIG_DEFAULT_PLATFORM;
    exports.CONFIG_DEFAULT_CHANNEL = CONFIG_DEFAULT_CHANNEL;
    exports.CONFIG_DEFAULT_MESSAGE = CONFIG_DEFAULT_MESSAGE;
    exports.CONFIG_DEFAULT_ACTION = CONFIG_DEFAULT_ACTION;

    exports.convert_from_1_1_2 = convert_from_1_1_2;
    exports.fill = fill;
    exports.validate = validate;

})(typeof exports === 'undefined' ? this['common'] = {} : exports);
