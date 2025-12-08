module.exports = {
    name: "ping",

    async execute(message) {
        message.reply(`🏓 Ping: **${Date.now() - message.createdTimestamp}ms**`);
    }
};
