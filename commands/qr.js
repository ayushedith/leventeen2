const QRCode = require('qrcode');

module.exports = {
  name: 'qr',
  description: 'Generate a QR code from your text or URL',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❗ Please provide text to convert.');

    try {
      const buffer = await QRCode.toBuffer(text);
      await message.reply({
        files: [{ attachment: buffer, name: 'qr.png' }]
      });
    } catch (err) {
      console.error(err);
      message.reply('❌ Failed to generate QR code.');
    }
  }
};
