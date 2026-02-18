export const registerHelpCommand = (bot) => {
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      "دستورات موجود:\n\n/start – شروع\n/packs – لیست پک‌ها\n/help – راهنما"
    );
  });
};
