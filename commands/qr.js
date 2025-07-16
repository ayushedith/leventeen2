const QRCode = require('qrcode');
const path = require('path');

// 🧠 Fix for Jimp import issues (handles ESM vs CommonJS)
let Jimp;
try {
  const jimpModule = require('jimp');
  Jimp = jimpModule.default || jimpModule;
} catch (err) {
  console.error('❌ Failed to load Jimp:', err);
}

module.exports = {
  name: 'qr',
  description: 'Generate a fancy QR code with optional logo overlay.',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) {
      return message.reply('❗ Please provide some text or a URL.');
    }

    try {
      // 1️⃣ Generate QR buffer
      const qrBuffer = await QRCode.toBuffer(text, {
        errorCorrectionLevel: 'H',
        width: 512,
        color: {
          dark: '#000000',      // QR foreground
          light: '#ffffff00'    // Transparent background
        }
      });

      // 2️⃣ Load the QR image into Jimp
      const qrImage = await Jimp.read(qrBuffer);

      // 3️⃣ Attempt to read the logo image
      const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
      let logo;
      try {
        logo = await Jimp.read(logoPath);
      } catch (err) {
        console.warn('⚠️ Logo not found. Sending QR without logo.');
        return message.reply({
          files: [{ attachment: qrBuffer, name: 'qr.png' }]
        });
      }

      // 4️⃣ Resize and overlay logo
      const logoSize = qrImage.bitmap.width / 4;
      logo.resize(logoSize, logoSize);

      const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
      const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;
      qrImage.composite(logo, x, y);

      // 5️⃣ Get final image buffer
      const finalBuffer = await qrImage.getBufferAsync(Jimp.MIME_PNG);

      // 6️⃣ Send the fancy QR
      return message.reply({
        files: [{ attachment: finalBuffer, name: 'fancy-qr.png' }]
      });

    } catch (err) {
      console.error('❌ Fancy QR error:', err);
      return message.reply('❌ Failed to generate fancy QR code.');
    }
  }
};
