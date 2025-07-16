require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const PREFIX = '!';
client.commands = new Collection();

// 🧠 Global patch to disable reply ping
client.on('messageCreate', (message) => {
  const originalReply = message.reply.bind(message);
  message.reply = (options) => {
    if (typeof options === 'string') {
      options = { content: options };
    }
    if (!options.allowedMentions) {
      options.allowedMentions = { repliedUser: false };
    }
    return originalReply(options);
  };
});

// 🔁 Load command files
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity('QRs | !help', { type: 'LISTENING' });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const isBoss = message.author.id === process.env.BOSS_ID;
  const bossModeEnabled = process.env.BOSS_MODE?.toLowerCase() === 'true';

  const text = message.content.trim();

  // 1️⃣ PREFIX commands
  if (text.startsWith(PREFIX)) {
    const args = text.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (err) {
      console.error(`❌ Error in !${commandName}:`, err);
      message.reply('❌ Something went wrong.');
    }
  }

  // 2️⃣ BOSS no-prefix commands
  else if (isBoss && bossModeEnabled) {
    const args = text.split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName || commandName.length < 2) return;

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (err) {
      console.error(`❌ Boss command failed (${commandName}):`, err);
      message.reply('❌ Something went wrong.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
