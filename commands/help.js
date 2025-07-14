module.exports = {
  name: 'help',
  description: 'List all available commands',
  async execute(message) {
    const helpText = `
**🧠 Available Commands**
\`!qr <text>\` → Generate QR code from text or URL  
\`!ping\` → See bot latency  
\`!help\` → Show this help message
    `;
    message.reply(helpText);
  }
};
