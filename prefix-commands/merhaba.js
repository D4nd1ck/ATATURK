module.exports = {
    name: "merhaba",
    description: "Belirtilen kanala merhaba mesajı gönderir",
    async execute(message, args, client) {
        // client burada kullanılabilir
        client.channels.cache.get("KANAL_ID")?.send("Merhaba!");
        message.reply("Mesaj gönderildi!");
    }
};
