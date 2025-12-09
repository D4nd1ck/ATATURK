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

        const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

        // Buton tıklama listener
        const filter = i => ["oyun_btn", "renk_btn", "ses_btn"].includes(i.customId) && i.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 }); // 1 dakika aktif

        collector.on("collect", async i => {
            switch(i.customId) {
                case "oyun_btn":
                    await i.reply({ content: "🎮 Oyun komutları: `a!oyun liste`", ephemeral: true });
                    break;
                case "renk_btn":
                    await i.reply({ content: "🌈 Renk komutları: `a!renk liste`", ephemeral: true });
                    break;
                case "ses_btn":
                    await i.reply({ content: "🔊 Ses komutları: `a!ses baglan`, `a!ses cik`", ephemeral: true });
                    break;
            }
        });

        collector.on("end", () => {
            // Butonları pasifleştir
            const disabledRow = new MessageActionRow().addComponents(
                row.components.map(btn => btn.setDisabled(true))
            );
            sentMessage.edit({ components: [disabledRow] });
        });
    }
};
