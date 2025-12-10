const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus 
} = require("@discordjs/voice");
const path = require("path");

module.exports = {
    playAtaturk: async (client, channelId) => {
        const channel = client.channels.cache.get(channelId);
        if (!channel) return console.log("Ses kanalı bulunamadı!");

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        const filePath = path.join(__dirname, "ataturk.mp3"); // Ses dosyası

        const player = createAudioPlayer();
        const resource = createAudioResource(filePath);

        player.play(resource);
        connection.subscribe(player);

        console.log("Atatürk konuşması çalıyor!");

        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Konuşma bitti.");
            // connection.destroy(); // İstersen kanaldan çıkması için açabilirsin
        });
    }
};
