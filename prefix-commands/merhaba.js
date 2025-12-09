module.exports = {
    name: "merhaba",
    description: "Belirtilen kanala merhaba mesajı gönderir",
    async execute(message, args, client) {
        client.channels.cache.get("1446168218459832464")?.send("Merhaba!");
        message.reply("Mesaj gönderildi!");
    }
};
