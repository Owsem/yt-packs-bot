export const registerSupportCommand = (bot) => {
  bot.onText(/\/support/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, "📞 *Support Menu*", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Contact Admin", url: "https://t.me/yourusername" }],
          [{ text: "FAQ", callback_data: "support_faq" }],
          [{ text: "How to Buy", callback_data: "support_how" }]
        ]
      }
    });
  });

  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (data === "support_faq") {
      return bot.sendMessage(
        chatId,
        "❓ *FAQ*\n\n• Packs are delivered instantly.\n• You can re-download anytime using /mypurchases.",
        { parse_mode: "Markdown" }
      );
    }

    if (data === "support_how") {
      return bot.sendMessage(
        chatId,
        "🛒 *How to Buy*\n\n1. Open /packs\n2. Choose a pack\n3. Tap Buy\n4. Receive your download instantly",
        { parse_mode: "Markdown" }
      );
    }
  });
};
