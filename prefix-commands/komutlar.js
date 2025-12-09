// Prefix komutlar
client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    const command = client.prefixCommands.get(cmd);
    if (!command) return;

    try {
        if (cmd === "yardim") {
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
                        .setLabel("🌈 Renk Komutları") // ✅ Renk butonu
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("ses_btn")
                        .setLabel("🔊 Ses Komutları")
                        .setStyle("SECONDARY")
                );

            await message.channel.send({ embeds: [embed], components: [row] });
        } else {
            await command.execute(message, args, client);
        }
    } catch (error) {
        console.error(error);
        message.reply("Komut çalıştırılırken bir hata oluştu!");
    }
});

// Buton tıklama handler
client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    switch(interaction.customId) {
        case "oyun_btn":
            await interaction.reply({ content: "🎮 Oyun komutları: `/oyun liste`", ephemeral: true });
            break;
        case "renk_btn": // ✅ Renk butonu tıklama cevabı
            await interaction.reply({ content: "🌈 Renk komutları: `/renk liste`", ephemeral: true });
            break;
        case "ses_btn":
            await interaction.reply({ content: "🔊 Ses komutları: `/ses baglan`, `/ses cik`", ephemeral: true });
            break;
    }
});
