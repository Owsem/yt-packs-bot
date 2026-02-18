import Theme from "../models/Theme.js";
import { formatPrice } from "../utils/helpers.js";

export const registerPacksCommand = (bot) => {
  bot.onText(/\/packs/, async (msg) => {
    const chatId = msg.chat.id;

    const themes = await Theme.find({ isActive: true }).sort({ createdAt: -1 });

    if (!themes.length) {
      await bot.sendMessage(chatId, "فعلاً هیچ پکی موجود نیست.");
      return;
    }

    const keyboard = themes.map((t) => [
      {
        text: `${t.name} – ${formatPrice(t.price)}`,
        callback_data: `buy_${t.slug}`
      }
    ]);

    await bot.sendMessage(chatId, "پک‌های موجود:", {
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  });
};
