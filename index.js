const express = require('express');
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is not set');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// برای اینکه Render بفهمه سرویس زنده است
app.get('/', (req, res) => {
  res.send('Owsem Telegram Bot is running ✅');
});

// هندل /start
bot.start((ctx) => ctx.reply('ربات اختصاصی Owsem روی Render روشنه 🔥'));

// اتصال Webhook
app.use(bot.webhookCallback('/telegram-webhook'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  const webhookUrl = `${process.env.RENDER_EXTERNAL_URL}/telegram-webhook`;
  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log('Webhook set to:', webhookUrl);
  } catch (err) {
    console.error('Error setting webhook:', err);
  }
});
