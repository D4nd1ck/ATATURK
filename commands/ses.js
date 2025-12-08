const { 
    SlashCommandBuilder 
} = require("discord.js");

const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus 
} = require("@discordjs/voice");

const play = require("play-dl");
const sesEfektleri = require("../utils/sesEfektleri");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ses")
        .setDescription("Ses komutları")
        .addSubcommand(s => 
            s.setName("baglan")
             .setDescription("Bir ses kanalına bağlan")
        )
        .addSubcommand(s => 
            s.setName("oynat")
             .setDescription("Müzik çalar")
             .addStringOption(o =>
                o.setName("link")
                 .setDescription("YouTube linki")
                 .setRequired(true)
             )
        )
        .addSubcommand(s =>
            s.setName("dur")
             .setDescription("Müziği durdurur")
        )
        .addSubcommand(s =>
            s.setName("efekt")
             .setDescription("Ses efekti çalar")
             .addStringOption(o =>
                o.setName("ad")
                 .setDescription("Efekt adı")
                 .setRequired(true)
             )
        ),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const kanal = interaction.member.voice.channel;

        // Sesli kanalda değilse
        if (!kanal && sub !== "baglan")
            return interaction.reply("❌ Önce bir ses kanalına gir.");

        if (sub === "baglan") {
            if (!kanal) return interaction.reply("❌ Bir ses kanalında değilsin.");

            joinVoiceChannel({
                channelId: kanal.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

            return interaction.reply("🔊 **Ses kanalına bağlanıldı.**");
        }

        if (sub === "oynat") {
            const link = interaction.options.getString("link");

            let yt = await play.stream(link);
            const player = createAudioPlayer();
            const resource = createAudioResource(yt.stream, { inputType: yt.type });

            joinVoiceChannel({
                channelId: kanal.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

            player.play(resource);

            interaction.guild.voiceStatePlayer = player;
            kanal.guild.members.me.voice.connection.subscribe(player);

            return interaction.reply(`🎶 **Oynatılıyor:** ${link}`);
        }

        if (sub === "dur") {
            const player = interaction.guild.voiceStatePlayer;
            if (!player) return interaction.reply("❌ Zaten müzik çalmıyor.");

            player.stop();
            return interaction.reply("⏹ **Müzik durduruldu.**");
        }

        if (sub === "efekt") {
            const ad = interaction.options.getString("ad");
            const efekt = sesEfektleri[ad];

            if (!efekt)
                return interaction.reply("❌ Böyle bir efekt yok!");

            const player = createAudioPlayer();
            const resource = createAudioResource(efekt);

            joinVoiceChannel({
                channelId: kanal.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

            kanal.guild.members.me.voice.connection.subscribe(player);
            player.play(resource);

            return interaction.reply(`🔊 **Efekt çalınıyor:** ${ad}`);
        }
    }
};
