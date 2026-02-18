import Order from "../models/Order.js";
import Theme from "../models/Theme.js";
import User from "../models/User.js";

export const deliverThemeToUser = async (bot, telegramUser, themeSlug, chatId) => {
  const theme = await Theme.findOne({ slug: themeSlug, isActive: true });
  if (!theme) {
    await bot.sendMessage(chatId, "This pack is not available.");
    return;
  }

  let user = await User.findOne({ telegramId: String(telegramUser.id) });
  if (!user) {
    user = await User.create({
      telegramId: String(telegramUser.id),
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name
    });
  }

  const order = await Order.create({
    user: user._id,
    theme: theme._id,
    status: "completed"
  });

  user.purchases.push(order._id);
  await user.save();

  await bot.sendMessage(
    chatId,
    `Your purchase is confirmed ✅\n\nPack: ${theme.name}\nHere is your download:`
  );

  await bot.sendDocument(chatId, theme.fileUrl, {
    caption: `Pack: ${theme.name} – thanks for your purchase ✨`
  });
};
