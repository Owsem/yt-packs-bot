export const registerStartCommand = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";

    await bot.sendMessage(
      chatId,
      `سلام ${firstName} 👋\n\nبه ربات پک‌های یوتیوب خوش اومدی.\n\nبرای دیدن پک‌ها /packs رو بزن.`
    );
  });
};
