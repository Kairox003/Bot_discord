const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN;

const STAFF_ROLE_ID = '1498018738753110217';
const ASSISTENZA_CHANNEL_ID = '1508549805121732753';

client.once(Events.ClientReady, () => {
    console.log('Bot online!');
});

client.on(Events.MessageCreate, async message => {

    if (message.author.bot) return;

    if (message.content.startsWith('!convoca')) {

        if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
            return message.reply('Non sei staff.');
        }

        const utente = message.mentions.users.first();

        if (!utente) {
            return message.reply('Tagga un utente.');
        }

        const canale =
            message.guild.channels.cache.get(
                ASSISTENZA_CHANNEL_ID
            );

        const embed = new EmbedBuilder()
            .setColor('#111111')
            .setTitle('📞 Convocazione')
            .setDescription(
                `${utente} sei stato convocato da ${message.author}`
            )
            .setTimestamp();

        await canale.send({
            content: `${utente}`,
            embeds: [embed]
        });

        await message.reply('Convocazione inviata.');
    }
});

client.login(TOKEN);
