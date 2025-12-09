require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ],
});

// Slash komutları için koleksiyon
client.slashCommands = new Collection();

// Slash komutları yükleme
let slashFiles = [];
if (fs.existsSync("./slash-commands")) {
    slashFiles = fs.readdirSync("./slash-commands").filter(file => file.endsWith(".js"));
}
for (const file of slashFiles) {
    const command = require(`./slash-commands/${file}`);
    client.slashCommands.set(command.data.name, command);
}

// Bot hazır olduğunda
client.on("ready", () => {
    console.log(`ATATÜRK Botu aktif: ${client.user.tag}`);
});

// Slash komutları ve butonları dinleme
client.on("interactionCreate", async interaction => {
    // Slash komutları
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Komut çalıştırılırken bir hata oluştu!", ephemeral: true });
        }
    }

    // Button etkileşimleri
    if (interaction.isButton()) {
        switch(interaction.customId) {
            case "oyun_btn":
                await interaction.reply({ content: "🎮 Oyun komutları: `/oyun liste`", ephemeral: true });
                break;
            case "renk_btn":
                await interaction.reply({ content: "🌈 Renk komutları: `/renk liste`", ephemeral: true });
                break;
            case "ses_btn":
                await interaction.reply({ content: "🔊 Ses komutları: `/ses baglan`, `/ses cik`", ephemeral: true });
                break;
        }
    }
});

client.login(process.env.TOKEN);
