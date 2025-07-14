require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const QRCode = require('qrcode');

// Setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const PREFIX = '!'; // Command prefix

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  client.user.setActivity('QR codes | !qr', { type: 'LISTENING' });
});

// Message listener
client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore bot messages
  if (!message.content.startsWith(PREFIX)) return;

  const [cmd, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);

  if (cmd === 'qr') {
    const text = args.join(' ');
    if (!text) return message.reply('❗ Please provide text to convert.');

    try {
      const qrBuffer = await QRCode.toBuffer(text);
      await message.reply({
        files: [{ attachment: qrBuffer, name: 'qr.png' }]
      });
    } catch (err) {
      console.error('❌ QR generation failed:', err);
      message.reply('❌ Could not generate QR code.');
    }
  }
   else if (cmd === 'ping') {
    const sent = await message.reply('🏓 Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    sent.edit(`🏓 Pong! Latency: ${latency}ms | API: ${apiLatency}ms`);
  }
});

client.login(process.env.DISCORD_TOKEN);
