const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Botun gecikmesini gösterir"),

    async execute(interaction) {
        interaction.reply(`🏓 Gecikme: **${Date.now() - interaction.createdTimestamp}ms**`);
    }
};
