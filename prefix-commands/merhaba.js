module.exports = {
    name: "merhaba",
    description: "Belirtilen kanala merhaba mesajı gönderir",
    async execute(message, args, client) {
        client.channels.cache.get("KANAL_ID")?.send("Merhaba!");
        message.reply("Mesaj gönderildi!");
    }
};
