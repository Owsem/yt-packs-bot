import Settings from "../models/Settings.js";

export const registerSocialCommand = (bot) => {
  bot.onText(/\/social/, async (msg) => {
    const chatId = msg.chat.id;

    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const sm = settings.socialMedia;

    const keyboard = [];

    if (sm.tiktok) keyboard.push([{ text: "TikTok", url: sm.tiktok }]);
    if (sm.telegram) keyboard.push([{ text: "Telegram", url: sm.telegram }]);
    if (sm.pinterest) keyboard.push([{ text: "Pinterest", url: sm.pinterest }]);
    if (sm.reddit) keyboard.push([{ text: "Reddit", url: sm.reddit }]);

    if (keyboard.length === 0) {
      return bot.sendMessage(chatId, "No social media links have been set yet.");
    }

    await bot.sendMessage(chatId, "🌐 *Our Social Media:*", {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard }
    });
  });
};
