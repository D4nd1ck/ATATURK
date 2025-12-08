const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const renkListesi = require("../utils/renkListesi");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("renk")
        .setDescription("Renk komutları")
        .addSubcommand(sub =>
            sub.setName("liste").setDescription("Mevcut renkleri gösterir")
        )
        .addSubcommand(sub =>
            sub.setName("sec")
                .setDescription("Bir renk seç")
                .addStringOption(o =>
                    o.setName("renk")
                     .setDescription("Renk adı")
                     .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName("sifirla")
                .setDescription("Renk rolünü kaldırır")
        ),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === "liste") {
            const embed = new EmbedBuilder()
                .setTitle("🎨 Renk Listesi")
                .setColor("#3498db")
                .setDescription(
                    renkListesi.map(r => `• **${r.isim}** — ${r.hex}`).join("\n")
                );

            return interaction.reply({ embeds: [embed] });
        }

        const member = interaction.member;

        if (sub === "sec") {
            const secim = interaction.options.getString("renk");
            const renk = renkListesi.find(r => r.isim.toLowerCase() === secim.toLowerCase());

            if (!renk)
                return interaction.reply("❌ Böyle bir renk yok.");

            const rol = await interaction.guild.roles.create({
                name: `Renk-${renk.isim}`,
                color: renk.hex,
                reason: "Renk rolü"
            });

            await member.roles.add(rol);
            return interaction.reply(`✔ **${renk.isim}** rengi seçildi.`);
        }

        if (sub === "sifirla") {
            const renkRolleri = member.roles.cache.filter(r => r.name.startsWith("Renk-"));
            renkRolleri.forEach(r => r.delete());

            return interaction.reply("✔ Renk rolün sıfırlandı.");
        }
    }
};
