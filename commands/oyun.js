const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const oyunlar = require("../utils/oyunListesi");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("oyun")
        .setDescription("Oyun rol komutları")
        .addSubcommand(s => s
            .setName("liste")
            .setDescription("Oyun listesi göster")
        )
        .addSubcommand(s => s
            .setName("sec")
            .setDescription("Oyun rolü seç")
            .addStringOption(o =>
                o.setName("oyun").setDescription("Oyun adı").setRequired(true)
            )
        )
        .addSubcommand(s => s
            .setName("kaldir")
            .setDescription("Oyun rolünü kaldır")
            .addStringOption(o =>
                o.setName("oyun").setDescription("Oyun adı").setRequired(true)
            )
        ),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const oyun = interaction.options.getString("oyun");
        const member = interaction.member;

        if (sub === "liste") {
            const embed = new EmbedBuilder()
                .setTitle("🎮 Oyun Rolleri")
                .setColor("Random")
                .setDescription(oyunlar.map(o => `• **${o}**`).join("\n"));

            return interaction.reply({ embeds: [embed] });
        }

        if (sub === "sec") {
            if (!oyunlar.includes(oyun)) return interaction.reply("❌ Böyle bir oyun yok!");

            let rol = interaction.guild.roles.cache.find(r => r.name === oyun);
            if (!rol) rol = await interaction.guild.roles.create({ name: oyun });

            await member.roles.add(rol);
            return interaction.reply(`✔ **${oyun}** rolü verildi.`);
        }

        if (sub === "kaldir") {
            let rol = interaction.guild.roles.cache.find(r => r.name === oyun);
            if (!rol) return interaction.reply("❌ Böyle bir rol yok.");

            await member.roles.remove(rol);
            return interaction.reply(`✔ **${oyun}** rolün kaldırıldı.`);
        }
    }
};
