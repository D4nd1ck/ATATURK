// slash-commands/ayarlar.js
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayarlar')
        .setDescription('Ayarlar panelini açar'),

    async execute(interaction) {
        // Butonları oluşturuyoruz
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('oyun_btn')
                    .setLabel('Oyun Komutları')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('renk_btn')
                    .setLabel('Renk Komutları')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('ses_btn')
                    .setLabel('Ses Komutları')
                    .setStyle(ButtonStyle.Secondary)
            );

        // Slash komutu ile mesaj gönderiyoruz
        await interaction.reply({ 
            content: 'Ayarlar paneli:', 
            components: [row], 
            ephemeral: true // sadece komutu kullanan kişi görür
        });
    }
};
