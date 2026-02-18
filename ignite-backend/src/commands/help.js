export const registerHelpCommand = (bot) => {
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      "Available commands:\n\n/start – Start the bot\n/packs – List available packs\n/help – Show this help"
    );
  });
};
