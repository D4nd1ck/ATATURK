const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yardim')
        .setDescription('Botun tüm komutlarını gösterir.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('ATATÜRK Bot Komutları')
            .setColor(0x1abc9c)
            .addFields(
                { name: '🎮 Oyun Komutları', value: '`/oyun liste`' },
                { name: '🌈 Renk Komutları', value: '`/renk liste`' },
                { name: '🔊 Ses Komutları', value: '`/ses baglan`, `/ses cik`' }
            )
            .setFooter({ text: 'ATATÜRK Bot © 2025' });

        await interaction.reply({ embeds: [embed] });
    },
};
