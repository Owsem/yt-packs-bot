import User from "../models/User.js";
import Order from "../models/Order.js";
import Theme from "../models/Theme.js";

export const registerMyPurchasesCommand = (bot) => {
  bot.onText(/\/mypurchases/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    const user = await User.findOne({ telegramId }).populate({
      path: "purchases",
      populate: { path: "theme" }
    });

    if (!user || !user.purchases.length) {
      return bot.sendMessage(chatId, "You have no purchases yet.");
    }

    let text = "🛒 *Your Purchases:*\n\n";
    const keyboard = [];

    for (const order of user.purchases) {
      if (!order.theme) continue;

      text += `• ${order.theme.name} — $${order.theme.price}\n`;

      keyboard.push([
        {
          text: `Download ${order.theme.name}`,
          callback_data: `download_${order.theme.slug}`
        }
      ]);
    }

    await bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard }
    });
  });

  // Handle download buttons
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!data.startsWith("download_")) return;

    const slug = data.replace("download_", "");
    const theme = await Theme.findOne({ slug });

    if (!theme) {
      return bot.sendMessage(chatId, "This pack is no longer available.");
    }

    await bot.sendDocument(chatId, theme.fileUrl, {
      caption: `Here is your pack: ${theme.name}`
    });
  });
};
