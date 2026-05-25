const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Events,
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ❌ stop if env missing
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error("❌ Missing TOKEN, CLIENT_ID or GUILD_ID");
    process.exit(1);
}

// ✅ minimal intents (NO MessageContent needed)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// 🔐 YOUR IDS
const STAFF_ROLE_ID = '1498018738753110217';
const ASSISTENZA_CHANNEL_ID = '1508549805121732753';

//
// 🧩 SLASH COMMAND
//
const commands = [
    new SlashCommandBuilder()
        .setName('convoca')
        .setDescription('Convoca un utente')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('Seleziona un utente')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivazione')
                .setDescription('Motivazione della convocazione')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(0)
        .toJSON()
];

//
// 🚀 REGISTER COMMAND
//
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log("🔄 Registering slash command...");

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log("✅ Slash command registered!");
    } catch (err) {
        console.error(err);
    }
})();

//
// 🤖 READY
//
client.once(Events.ClientReady, () => {
    console.log(`🤖 Bot online as ${client.user.tag}`);
});

//
// ⚙️ COMMAND HANDLER
//
client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== 'convoca') return;

    // 👤 OPTIONS
    const utente = interaction.options.getUser('utente');
    const motivazione = interaction.options.getString('motivazione');

    // 🔐 ROLE CHECK
    if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
        return interaction.reply({
            content: '❌ Non hai il permesso per usare questo comando.',
            ephemeral: true
        });
    }

    try {
        const channel = await interaction.guild.channels.fetch(ASSISTENZA_CHANNEL_ID);

        const embed = new EmbedBuilder()
            .setColor('#111111')
            .setTitle('📞 Convocazione')
            .setDescription(
                `📢 ${utente}\n👮 Convocato da: ${interaction.user}\n📝 Motivazione: **${motivazione}**`
            )
            .setTimestamp();

        await channel.send({
            content: `${utente}`,
            embeds: [embed]
        });

        await interaction.reply({
            content: '✅ Convocazione inviata.',
            ephemeral: true
        });

    } catch (err) {
        console.error(err);

        await interaction.reply({
            content: '❌ Errore nell’invio.',
            ephemeral: true
        });
    }
});

client.login(TOKEN);
