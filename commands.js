const { SlashCommandBuilder } = require('discord.js');

module.exports = [
  new SlashCommandBuilder()
    .setName('qr')
    .setDescription('Generate a QR code from your text or URL')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('The text or URL to convert to QR')
        .setRequired(true)
    )
    .toJSON()
];
