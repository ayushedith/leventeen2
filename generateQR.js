const QRCode = require('qrcode');

/**
 * Generate a QR code buffer (PNG) from text.
 * @param {string} text
 * @returns {Promise<Buffer>}
 */
async function generateQR(text) {
  return await QRCode.toBuffer(text, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 300,
    margin: 2,
    color: {
      dark: '#000',
      light: '#fff'
    }
  });
}

module.exports = generateQR;
