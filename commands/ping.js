module.exports = {
  name: 'ping',
  description: 'Check bot and API latency',
  async execute(message) {
    const sent = await message.reply('🏓 Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);
    sent.edit(`🏓 Pong! Latency: ${latency}ms | API: ${apiLatency}ms`);
  }
};
