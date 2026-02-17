// ===============================
// اتصال به دیتابیس و مدل‌ها
// ===============================

const mongoose = require('mongoose');
const { User, Pack, Order, Feedback } = require('./models');

mongoose.connect(process.env.MONGO_URI)
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
// روت تست
// ===============================

app.get('/', (req, res) => {
  res.send('Owsem Telegram Bot is running ✅');
});


// ===============================
// منوها
// ===============================

function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📦 پک‌ها", callback_data: "packs" }],
        [{ text: "🛒 سفارش‌های من", callback_data: "my_orders" }],
        [{ text: "📩 پشتیبانی", callback_data: "support" }],
        [{ text: "ℹ️ راهنما", callback_data: "help" }]
      ]
    }
  };
}

function backToMenuKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "⬅️ بازگشت به منوی اصلی", callback_data: "back_to_menu" }]
      ]
    }
  };
}


// ===============================
// /start
// ===============================

bot.start(async (ctx) => {
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

  await ctx.reply(
    "🔥 ربات تلگرام Owsem ران شد\n\nیکی از گزینه‌های زیر رو انتخاب کن:",
    mainMenu()
  );
});


// ===============================
// /help و /about
// ===============================

bot.command('help', async (ctx) => {
  await ctx.reply(
    "ℹ️ راهنما:\n\n" +
    "📦 پک‌ها: مشاهده لیست پک‌های موجود\n" +
    "🛒 سفارش‌های من: دیدن سفارش‌های ثبت‌شده\n" +
    "📩 پشتیبانی: ارسال پیام برای ادمین\n",
    mainMenu()
  );
});

bot.command('about', async (ctx) => {
  await ctx.reply(
    "👑 Owsem YouTube Packs Bot\n" +
    "طراحی شده برای فروش و مدیریت پک‌های یوتیوب به صورت خودکار.",
    mainMenu()
  );
});


// ===============================
// هندل دکمه‌ها
// ===============================

// بازگشت به منوی اصلی
bot.action("back_to_menu", async (ctx) => {
  await ctx.editMessageText(
    "🔥 برگشتی به منوی اصلی.\n\nیکی از گزینه‌های زیر رو انتخاب کن:",
    mainMenu()
  );
});

// 📦 پک‌ها
bot.action("packs", async (ctx) => {
  const packs = await Pack.find();

  if (packs.length === 0) {
    return ctx.reply("❌ هیچ پکی موجود نیست.", backToMenuKeyboard());
  }

  let text = "📦 *لیست پک‌های موجود:*\n\n";
  packs.forEach(p => {
    text += `🎵 *${p.name}*\n💰 قیمت: ${p.price} تومان\n📝 ${p.description || "بدون توضیحات"}\n\n`;
  });

  await ctx.reply(text, { parse_mode: "Markdown", ...backToMenuKeyboard() });
});

// 🛒 سفارش‌های من
bot.action("my_orders", async (ctx) => {
  const userId = ctx.from.id;
  const orders = await Order.find({ user_id: userId });

  if (orders.length === 0) {
    return ctx.reply("🛒 هنوز سفارشی ثبت نکردی.", backToMenuKeyboard());
  }

  let text = "🛒 *سفارش‌های شما:*\n\n";
  orders.forEach(o => {
    text += `📦 پک: ${o.pack_id}\n💰 قیمت: ${o.price} تومان\n📅 تاریخ: ${o.date.toLocaleString()}\nوضعیت: ${o.status}\n\n`;
  });

  await ctx.reply(text, { parse_mode: "Markdown", ...backToMenuKeyboard() });
});

// 📩 پشتیبانی
let waitingForSupportMessage = new Set();

bot.action("support", async (ctx) => {
  const userId = ctx.from.id;
  waitingForSupportMessage.add(userId);

  await ctx.reply(
    "📩 پیام خودت رو بفرست.\n\nهر متنی که الان بفرستی به عنوان تیکت ثبت می‌شه.",
    backToMenuKeyboard()
  );
});

// ℹ️ راهنما
bot.action("help", async (ctx) => {
  await ctx.reply(
    "ℹ️ راهنما:\n\n" +
    "📦 پک‌ها: مشاهده لیست پک‌های موجود\n" +
    "🛒 سفارش‌های من: دیدن سفارش‌های ثبت‌شده\n" +
    "📩 پشتیبانی: ارسال پیام برای ادمین\n",
    backToMenuKeyboard()
  );
});


// ===============================
// هندل پیام‌های متنی (برای پشتیبانی)
// ===============================

bot.on("text", async (ctx) => {
  const userId = ctx.from.id;

  // اگر کاربر در حالت ارسال پیام پشتیبانی است
  if (waitingForSupportMessage.has(userId)) {
    await Feedback.create({
      user_id: userId,
      content: ctx.message.text
    });

    waitingForSupportMessage.delete(userId);

    return ctx.reply(
      "✅ پیام شما ثبت شد. پشتیبانی به‌زودی پاسخ می‌دهد.",
      mainMenu()
    );
  }

  // اگر پیام عادی است
  await ctx.reply(
    "متوجه نشدم چی می‌خوای 😅\nاز منوی زیر یکی رو انتخاب کن:",
    mainMenu()
  );
});


// ===============================
// Webhook
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
