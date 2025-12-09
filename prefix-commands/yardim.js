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

        // Buton tıklama listener
        const filter = i => ["oyun_btn", "renk_btn", "ses_btn"].includes(i.customId) && i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 }); // 1 dakika aktif

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

        collector.on("end", collected => {
            // İsteğe bağlı: butonları pasifleştirebilirsiniz
            row.components.forEach(btn => btn.setDisabled(true));
            message.channel.send({ content: "Yardım menüsü süresi doldu.", components: [row] });
        });
    }
};
