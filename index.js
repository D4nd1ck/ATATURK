require("dotenv").config();
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
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

client.commands = new Collection();
client.prefixCommands = new Collection();

// Slash komutlarını yükle
const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Prefix komutlarını yükle
const prefixFiles = fs.readdirSync("./prefix-commands");
for (const file of prefixFiles) {
    const command = require(`./prefix-commands/${file}`);
    client.prefixCommands.set(command.name, command);
}

client.on("ready", () => {
    console.log(`ATATÜRK Botu aktif: ${client.user.tag}`);
});

// Slash komutlar
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    await cmd.execute(interaction, client);
});

// Prefix komutlar
client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    const command = client.prefixCommands.get(cmd);
    if (!command) return;

    await command.execute(message, args, client);
});

client.login(process.env.TOKEN);
