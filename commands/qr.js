const QRCode = require('qrcode');
const Jimp = require('jimp');

module.exports = {
  name: 'qr',
  description: 'Generate a fancy QR code from your text or URL',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('❗ Please provide text to convert.');

    try {
      // 1️⃣ Generate QR code as PNG buffer
      const qrBuffer = await QRCode.toBuffer(text, {
        color: {
          dark: '#0f0f0f',    // QR code color
          light: '#ffffff00'  // Transparent background
        },
        errorCorrectionLevel: 'H',
        width: 512
      });

      // 2️⃣ Load QR code and logo
      const qrImage = await Jimp.read(qrBuffer);
      const logo = await Jimp.read('https://i.imgur.com/ZT0pU8R.png'); // You can use local file too

      // 3️⃣ Resize logo to fit (1/4 of QR size)
      logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO);

      // 4️⃣ Composite logo at center
      const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
      const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;
      qrImage.composite(logo, x, y);

      // 5️⃣ Get buffer
      const finalBuffer = await qrImage.getBufferAsync(Jimp.MIME_PNG);

      // 6️⃣ Send result
      return message.reply({
        files: [{ attachment: finalBuffer, name: 'fancy-qr.png' }]
      });
    } catch (err) {
      console.error(err);
      message.reply('❌ Failed to generate fancy QR code.');
    }
  }
};
