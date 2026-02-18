export const registerStartCommand = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";

    await bot.sendMessage(
      chatId,
      `Hey ${firstName} 👋\n\nWelcome to the YouTube packs bot.\n\nUse /packs to see available packs.`
    );
  });
};
