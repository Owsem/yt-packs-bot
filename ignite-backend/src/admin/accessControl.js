const ADMIN_ID = "5998441772"; // your Telegram ID

export const isAdmin = (telegramId) => {
  return String(telegramId) === ADMIN_ID;
};

export const requireAdmin = async (bot, msg, callback) => {
  const userId = msg.from?.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(
      msg.chat.id,
      "You are not authorized to access this panel."
    );
    return false;
  }

  if (callback) await callback();
  return true;
};
