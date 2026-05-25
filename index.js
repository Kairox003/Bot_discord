const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Events
} = require('discord.js');

console.log("TOKEN EXISTS:", !!process.env.TOKEN);
console.log("TOKEN LENGTH:", process.env.TOKEN?.length);

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error("❌ TOKEN MISSING IN RAILWAY ENV");
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
            return message.reply('❌ Canale non trovato.');
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
        console.error(err);
        await message.reply('❌ Errore nell’invio.');
    }
});

client.login(TOKEN);
client.login(TOKEN);
