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

// 🔁 Load all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// 🤖 Bot ready
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity('QRs | !help', { type: 'LISTENING' });
});

// 📩 Handle messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const isBoss = message.author.id === process.env.BOSS_ID;
  const args = message.content.trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  // 🟢 Normal commands with prefix
  if (message.content.startsWith(PREFIX)) {
    const commandName = cmd.slice(PREFIX.length);
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (err) {
      console.error(`❌ Error in command ${commandName}:`, err);
      message.reply('❌ Something went wrong.');
    }
  }

  // 👑 Boss-only no-prefix QR shortcut
  else if (isBoss) {
  const text = [cmd, ...args].join(' ').trim();

  // 🧠 Add filters to avoid replying to short/random messages
  if (text.length < 5 && !text.startsWith('http')) return;

  const qr = client.commands.get('qr');
  if (!qr) return;
  try {
    await qr.execute(message, [text]);
  } catch (err) {
    console.error('❌ Boss QR failed:', err);
  }
}
  // 🆘 Help command
  else if (cmd === 'help') {
    const help = client.commands.get('help');
    if (help) {
      try {
        await help.execute(message);
      } catch (err) {
        console.error('❌ Help command failed:', err);
      }
    }
  }

  // 🏓 Ping command
  else if (cmd === 'ping') {
    const ping = client.commands.get('ping');
    if (ping) {
      try {
        await ping.execute(message);
      } catch (err) {
        console.error('❌ Ping command failed:', err);
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);