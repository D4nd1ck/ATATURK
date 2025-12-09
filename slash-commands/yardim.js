let slashFiles = [];
if (fs.existsSync("./slash-commands")) {
    slashFiles = fs.readdirSync("./slash-commands").filter(file => file.endsWith(".js"));
}
for (const file of slashFiles) {
    const command = require(`./slash-commands/${file}`);
    client.slashCommands.set(command.data.name, command);
}
