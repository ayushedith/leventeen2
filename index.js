require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const generateQR = require('./generateQR');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`🤖  is online as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'qr') {
    const text = interaction.options.getString('text');
    try {
      const qrBuffer = await generateQR(text);
      await interaction.reply({
        files: [{ attachment: qrBuffer, name: 'qr.png' }]
      });
    } catch (err) {
      console.error(err);
      await interaction.reply('❌ Error generating QR code.');
    }
  }
});
console.log(process.env.DISCORD_TOKEN)
client.login(process.env.DISCORD_TOKEN);
