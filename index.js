require("dotenv").config();
const { Client, GatewayIntentBits, Collection, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const fs = require("fs");
const { prefix } = require("./config");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.prefixCommands = new Collection();

// prefix komutlarını yükle
const prefixFiles = fs.readdirSync("./prefix-commands").filter(file => file.endsWith(".js"));
for (const file of prefixFiles) {
    const command = require(`./prefix-commands/${file}`);
    client.prefixCommands.set(command.name, command);
}

client.on("ready", () => {
    console.log(`ATATÜRK Botu aktif: ${client.user.tag}`);
});

client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.prefixCommands.get(cmd);
    if (!command) return;

    try {
        // Eğer "yardim" komutu ise butonlu menüyü göster
        if (cmd === "yardim") {
            const embed = new MessageEmbed()
                .setTitle("ATATÜRK Bot — Yardım Menüsü")
                .setColor("BLUE")
                .setDescription("Aşağıdaki butonlardan bir kategori seçin.");

            const row = new MessageActionRow().addComponents(
                new MessageButton().setCustomId("oyun_btn").setLabel("🎮 Oyun Komutları").setStyle("PRIMARY"),
                new MessageButton().setCustomId("renk_btn").setLabel("🌈 Renk Komutları").setStyle("SUCCESS"),
                new MessageButton().setCustomId("ses_btn").setLabel("🔊 Ses Komutları").setStyle("SECONDARY")
            );

            const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

            // Buton tıklama listener
            const filter = i => ["oyun_btn", "renk_btn", "ses_btn"].includes(i.customId) && i.user.id === message.author.id;
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

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
                const disabledRow = new MessageActionRow().addComponents(
                    row.components.map(btn => btn.setDisabled(true))
                );
                sentMessage.edit({ components: [disabledRow] });
            });

        } else {
            // Diğer prefix komutlarını çalıştır
            await command.execute(message, args, client);
        }
    } catch (error) {
        console.error(error);
        message.reply("Komut çalıştırılırken bir hata oluştu!");
    }
});

// Buton tıklama handler (ekstra güvenlik)
client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    try {
        switch(interaction.customId) {
            case "oyun_btn":
                await interaction.reply({ content: "🎮 Oyun komutları: `a!oyun liste`", ephemeral: true });
                break;
            case "renk_btn":
                await interaction.reply({ content: "🌈 Renk komutları: `a!renk liste`", ephemeral: true });
                break;
            case "ses_btn":
                await interaction.reply({ content: "🔊 Ses komutları: `a!ses baglan`, `a!ses cik`", ephemeral: true });
                break;
        }
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.TOKEN);
