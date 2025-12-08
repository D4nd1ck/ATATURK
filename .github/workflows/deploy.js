require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Slash komutlar Discord'a yükleniyor...`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), // Global komutlar
            { body: commands }
        );

        console.log("Slash komutlar başarıyla yüklendi!");
    } catch (error) {
        console.error(error);
    }
})();
