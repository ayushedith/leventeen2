const QRCode = require('qrcode');
const Jimp = require('jimp');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  name: 'qr',
  description: 'Generate a fancy QR code with optional customization',
  async execute(message, args) {
    try {
      const input = args.join(' ');
      const parts = input.split('|').map(part => part.trim());

      const text = parts[0];
      if (!text) return message.reply('❌ Please provide the text/URL to encode.');

      let fg = '#000000';
      let bg = '#ffffff';
      let logoUrl = null;

      for (let part of parts.slice(1)) {
        if (part.startsWith('fg=')) fg = part.split('=')[1];
        if (part.startsWith('bg=')) bg = part.split('=')[1];
        if (part.startsWith('logo=')) logoUrl = part.split('=')[1];
      }

      // Generate base QR
      const qrBuffer = await QRCode.toBuffer(text, {
        color: {
          dark: fg,
          light: bg,
        },
        width: 500,
        margin: 2,
      });

      let qrImage = await Jimp.read(qrBuffer);

      // If logo provided, add to center
      if (logoUrl) {
        try {
          const logo = await Jimp.read(logoUrl);
          logo.resize(100, 100);
          qrImage.composite(logo, (qrImage.bitmap.width - 100) / 2, (qrImage.bitmap.height - 100) / 2);
        } catch (e) {
          console.error('Logo Error:', e.message);
          await message.reply('⚠️ Logo not added: Failed to load image.');
        }
      }

      const finalBuffer = await qrImage.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new AttachmentBuilder(finalBuffer, { name: 'custom_qr.png' });
      await message.reply({ content: '✅ Here is your custom QR:', files: [attachment], allowedMentions: { repliedUser: false } });

    } catch (err) {
      console.error('QR Error:', err);
      await message.reply('❌ Failed to generate fancy QR code.');
    }
  }
};
