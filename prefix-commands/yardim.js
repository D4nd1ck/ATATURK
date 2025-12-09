// ./prefix-commands/yardim.js
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    name: "yardim",
    description: "Butonlu yardım menüsü gösterir",
    async execute(message, args, client) {
        const embed = new MessageEmbed()
            .setTitle("ATATÜRK Bot — Yardım Menüsü")
            .setColor("BLUE")
            .setDescription("Aşağıdaki butonlardan bir kategori seçin.");

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("oyun_btn")
                    .setLabel("🎮 Oyun Komutları")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("renk_btn")
                    .setLabel("🌈 Renk Komutları")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("ses_btn")
                    .setLabel("🔊 Ses Komutları")
                    .setStyle("SECONDARY")
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
};
