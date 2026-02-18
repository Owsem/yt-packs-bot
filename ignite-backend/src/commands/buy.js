import { deliverThemeToUser } from "../services/delivery.js";

export const registerBuyHandler = (bot) => {
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!data.startsWith("buy_")) return;

    const slug = data.replace("buy_", "");

    await bot.answerCallbackQuery(query.id, { text: "Processing your purchase..." });

    await deliverThemeToUser(bot, query.from, slug, chatId);
  });
};
