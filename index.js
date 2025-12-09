require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
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

// prefix komutları yükle
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
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply("Komut çalıştırılırken bir hata oluştu!");
    }
});

client.login(process.env.TOKEN);
