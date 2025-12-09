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
        // 1️⃣ Slash komut
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return;
            await cmd.execute(interaction, client);
        } 

        // 2️⃣ Select Menu
        else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'yardim_menu') {
                let embed;
                switch(interaction.values[0]) {
                    case 'oyun':
                        embed = new MessageEmbed()
                            .setTitle('🎮 Oyun Komutları')
                            .setDescription('`/oyun liste`')
                            .setColor("BLUE");
                        break;
                    case 'renk':
                        embed = new MessageEmbed()
                            .setTitle('🌈 Renk Komutları')
                            .setDescription('`/renk liste`')
                            .setColor("GREEN");
                        break;
                    case 'ses':
                        embed = new MessageEmbed()
                            .setTitle('🔊 Ses Komutları')
                            .setDescription('`/ses baglan`, `/ses cik`')
                            .setColor("RED");
                        break;
                }
                await interaction.update({ embeds: [embed] });
            }
        } 

        // 3️⃣ Button handler (prefix yardim menüsü için)
        else if (interaction.isButton()) {
            let embed;
            switch(interaction.customId) {
                case 'oyun_btn':
                    embed = new MessageEmbed()
                        .setTitle('🎮 Oyun Komutları')
                        .setDescription('`a!oyun liste`')
                        .setColor("BLUE");
                    break;
                case 'renk_btn':
                    embed = new MessageEmbed()
                        .setTitle('🌈 Renk Komutları')
                        .setDescription('`a!renk liste`')
                        .setColor("GREEN");
                    break;
                case 'ses_btn':
                    embed = new MessageEmbed()
                        .setTitle('🔊 Ses Komutları')
                        .setDescription('`a!ses baglan`, `a!ses cik`')
                        .setColor("RED");
                    break;
                default:
                    return;
            }

            await interaction.update({ embeds: [embed], components: [] }); // Butonları kaldırmak için components: []
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
    if (!command && cmd !== "yardim") return;

    try {
        // a!yardim komutu
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
                        .setLabel("🌈 Renk Komutları")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("ses_btn")
                        .setLabel("🔊 Ses Komutları")
                        .setStyle("DANGER")
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

client.login(process.env.TOKEN);
