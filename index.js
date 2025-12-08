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

client.commands = new Collection();
client.prefixCommands = new Collection();

// Slash komutlarını yükle
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Prefix komutlarını yükle
const prefixFiles = fs.readdirSync("./prefix-commands").filter(file => file.endsWith(".js"));
for (const file of prefixFiles) {
    const command = require(`./prefix-commands/${file}`);
    client.prefixCommands.set(command.name, command);
}

client.on("ready", () => {
    console.log(`ATATÜRK Botu aktif: ${client.user.tag}`);
});

// Interaction handler (Slash + Select Menu + Button)
client.on("interactionCreate", async interaction => {
    try {
        // Slash komut
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return;
            await cmd.execute(interaction, client);
        } 
        // Select Menu
        else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'yardim_menu') {
                let embed;
                switch(interaction.values[0]) {
                    case 'oyun':
                        embed = { title: '🎮 Oyun Komutları', description: '`/oyun liste`', color: 0x1abc9c };
                        break;
                    case 'renk':
                        embed = { title: '🌈 Renk Komutları', description: '`/renk liste`', color: 0x1abc9c };
                        break;
                    case 'ses':
                        embed = { title: '🔊 Ses Komutları', description: '`/ses baglan`, `/ses cik`', color: 0x1abc9c };
                        break;
                }
                await interaction.update({ embeds: [embed] });
            }
        } 
        // Button
        else if (interaction.isButton()) {
            if (interaction.customId === 'ornek_buton') {
                await interaction.reply({ content: "Butona tıkladın!", ephemeral: true });
            }
        }
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "Bir hata oluştu!", ephemeral: true });
        } else {
            await interaction.reply({ content: "Bir hata oluştu!", ephemeral: true });
        }
    }
});

// Prefix komutlar
client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
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
