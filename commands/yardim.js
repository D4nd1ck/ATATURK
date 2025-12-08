const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yardim")
    .setDescription("Tüm komutları kategoriler halinde gösterir"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("ATATÜRK Bot — Yardım Menüsü")
      .setColor(0x1abc9c)
      .setDescription("Aşağıdaki menüden bir kategori seçin.");

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("yardim_menu")
          .setPlaceholder("Kategori seç...")
          .addOptions([
            { label: "🎮 Oyun Komutları", value: "oyun" },
            { label: "🌈 Renk Komutları", value: "renk" },
            { label: "🔊 Ses Komutları", value: "ses" }
          ])
      );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
