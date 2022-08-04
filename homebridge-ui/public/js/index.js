(async () => {
    function clone(data) {
        return JSON.parse(JSON.stringify(data));
    }

    /** @var {array} */
    let platforms = await homebridge.getPluginConfig();

    platforms = common.convert_from_1_1_2(platforms);

    let errors = {};

    let platform = platforms.length ? platforms[0] : clone(common.CONFIG_DEFAULT_PLATFORM);

    platform = common.fill(platform, common.CONFIG);
    platform = common.validate(platform, common.CONFIG, errors);

    await homebridge.updatePluginConfig([
        clone(platform)
    ]);

    const app = Vue.createApp({
        data() {
            return {
                platform: platform,
                errors: errors
            };
        },
        watch: {
            platform: {
                async handler(platform) {
                    let errors = {};

                    platform = common.validate(platform, common.CONFIG, errors);

                    await homebridge.updatePluginConfig([
                        clone(platform),
                    ]);

                    this.errors = errors;
                },
                deep: true,
            },
        },
        methods: {
            name(name, cIdx = null, mIdx = null, aIdx = null) {
                if (aIdx !== null) { name = 'actions.' + aIdx + '.' + name; }
                if (mIdx !== null) { name = 'messages.' + mIdx + '.' + name; }
                if (cIdx !== null) { name = 'channels.' + cIdx + '.' + name; }

                return 'platform.' + name;
            },
            error(name, cIdx = null, mIdx = null, aIdx = null) {
                name = this.name(name, cIdx, mIdx, aIdx);

                return (name in this.errors) ? this.errors[name] : false;
            },
            addChannel() {
                if (!Array.isArray(this.platform.channels)) {
                    this.platform.channels = [];
                }

                this.platform.channels.push(
                    clone(common.CONFIG_DEFAULT_CHANNEL)
                );
            },
            removeChannel(cIdx) {
                this.platform.channels.splice(cIdx, 1);
            },
            addMessage(cIdx) {
                if (!Array.isArray(this.platform.channels[cIdx].messages)) {
                    this.platform.channels[cIdx].messages = [];
                }

                this.platform.channels[cIdx].messages.push(
                    clone(common.CONFIG_DEFAULT_MESSAGE)
                );
            },
            removeMessage(cIdx, mIdx) {
                this.platform.channels[cIdx].messages.splice(mIdx, 1);
            },
            addImage(cIdx, mIdx) {
                if (!Array.isArray(this.platform.channels[cIdx].messages[mIdx].images)) {
                    this.platform.channels[cIdx].messages[mIdx].images = [];
                }

                this.platform.channels[cIdx].messages[mIdx].images.push(
                    clone(common.CONFIG_DEFAULT_IMAGE)
                );
            },
            removeImage(cIdx, mIdx, iIdx) {
                this.platform.channels[cIdx].messages[mIdx].images.splice(iIdx, 1);
            },
            addFile(cIdx, mIdx) {
                if (!Array.isArray(this.platform.channels[cIdx].messages[mIdx].files)) {
                    this.platform.channels[cIdx].messages[mIdx].files = [];
                }

                this.platform.channels[cIdx].messages[mIdx].files.push(
                    clone(common.CONFIG_DEFAULT_FILE)
                );
            },
            removeFile(cIdx, mIdx, fIdx) {
                this.platform.channels[cIdx].messages[mIdx].files.splice(fIdx, 1);
            },
            addAction(cIdx, mIdx) {
                if (!Array.isArray(this.platform.channels[cIdx].messages[mIdx].actions)) {
                    this.platform.channels[cIdx].messages[mIdx].actions = [];
                }

                this.platform.channels[cIdx].messages[mIdx].actions.push(
                    clone(common.CONFIG_DEFAULT_ACTION)
                );
            },
            removeAction(cIdx, mIdx, aIdx) {
                this.platform.channels[cIdx].messages[mIdx].actions.splice(aIdx, 1);
            },
            defaultName(name, def) {
                if (name !== undefined && name.trim().length > 0) {
                    return name;
                }

                return '<i class="text-muted">' + def + '</i>';
            },
        },
    });

    app.mount('#app');
})();
