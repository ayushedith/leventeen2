const QRCode = require('qrcode');
const Jimp = require('jimp'); // works correctly in jimp@0.16.1
const path = require('path');

module.exports = {
  name: 'qr',
  description: 'Generate a fancy QR code with a logo',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) {
      return message.reply('❗ Please provide some text or a URL.');
    }

    try {
      // Step 1: Generate QR code buffer
      const qrBuffer = await QRCode.toBuffer(text, {
        errorCorrectionLevel: 'H',
        width: 512,
        color: {
          dark: '#000000',
          light: '#ffffff00'
        }
      });

      // Step 2: Load QR into Jimp
      const qrImage = await Jimp.read(qrBuffer);

      // Step 3: Load local logo
      const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
      let logo;
      try {
        logo = await Jimp.read(logoPath);
      } catch {
        console.warn('⚠️ Logo not found. Sending plain QR.');
        return message.reply({
          files: [{ attachment: qrBuffer, name: 'qr.png' }]
        });
      }

      // Step 4: Resize and composite logo
      const logoSize = qrImage.bitmap.width / 4;
      logo.resize(logoSize, logoSize);
      const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
      const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;
      qrImage.composite(logo, x, y);

      // Step 5: Send final image
      const finalBuffer = await qrImage.getBufferAsync(Jimp.MIME_PNG);
      return message.reply({
        files: [{ attachment: finalBuffer, name: 'fancy-qr.png' }]
      });

    } catch (err) {
      console.error('❌ Fancy QR error:', err);
      return message.reply('❌ Failed to generate fancy QR code.');
    }
  }
};
