const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Events
} = require('discord.js');

// ✅ TOKEN from environment (WORKS in Docker / Railway / Render / etc.)
const TOKEN = process.env.TOKEN;

// ❌ Stop immediately if token is missing
if (!TOKEN) {
    console.error("❌ ERROR: TOKEN is missing in environment variables!");
    console.error("👉 Add TOKEN in your hosting panel (NOT in code)");
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const STAFF_ROLE_ID = '1498018738753110217';
const ASSISTENZA_CHANNEL_ID = '1508549805121732753';

client.once(Events.ClientReady, () => {
    console.log(`🤖 Bot online as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {

    if (message.author.bot) return;

    if (!message.content.startsWith('!convoca')) return;

    if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
        return message.reply('❌ Non sei staff.');
    }

    const utente = message.mentions.users.first();

    if (!utente) {
        return message.reply('❌ Devi taggare un utente.');
    }

    try {
        const canale = await message.guild.channels.fetch(ASSISTENZA_CHANNEL_ID);

        if (!canale) {
            return message.reply('❌ Canale assistenza non trovato.');
        }

        const embed = new EmbedBuilder()
            .setColor('#111111')
            .setTitle('📞 Convocazione')
            .setDescription(`${utente} sei stato convocato da ${message.author}`)
            .setTimestamp();

        await canale.send({
            content: `${utente}`,
            embeds: [embed]
        });

        await message.reply('✅ Convocazione inviata.');

    } catch (err) {
        console.error("❌ Error:", err);
        await message.reply('❌ Errore nell’invio della convocazione.');
    }
});

client.login(TOKEN);
