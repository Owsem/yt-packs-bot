// ===============================
// اتصال به دیتابیس و وارد کردن مدل‌ها
// ===============================

const mongoose = require('mongoose');
const { User, Pack, Order, Feedback } = require('./models');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Error:', err));


// ===============================
// ساخت ربات و سرور
// ===============================

const express = require('express');
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is not set');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();


// ===============================
// روت اصلی برای تست
// ===============================

app.get('/', (req, res) => {
  res.send('Owsem Telegram Bot is running ✅');
});


// ===============================
// هندل /start
// ===============================

bot.start(async (ctx) => {
  // ذخیره کاربر در دیتابیس
  const user = ctx.from;

  await User.findOneAndUpdate(
    { user_id: user.id },
    {
      user_id: user.id,
      username: user.username || null,
      last_seen: new Date(),
      $setOnInsert: { first_seen: new Date() }
    },
    { upsert: true }
  );

  ctx.reply('ربات اختصاصی Owsem روی Render ران شد 🔥');
});


// ===============================
// اتصال Webhook
// ===============================

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
