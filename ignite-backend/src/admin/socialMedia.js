import Settings from "../models/Settings.js";
import { isAdmin } from "./accessControl.js";

const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

export const registerSocialMediaAdmin = (bot) => {
  // Admin panel button: "🌐 Social Media"
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!isAdmin(query.from.id)) return;

    if (data === "admin_social") {
      const settings = await getSettings();
      const sm = settings.socialMedia || {};

      const text =
        "🌐 Social Media Manager\n\n" +
        `TikTok: ${sm.tiktok || "not set"}\n` +
        `Telegram: ${sm.telegram || "not set"}\n` +
        `Pinterest: ${sm.pinterest || "not set"}\n` +
        `Reddit: ${sm.reddit || "not set"}\n\n` +
        "To update a link, use:\n" +
        "`!setsocial platform=<tiktok|telegram|pinterest|reddit>\nlink=<your_link>`";

      await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }
  });

  // Command: !setsocial
  bot.onText(/!setsocial([\s\S]*)/i, async (msg, match) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const body = match[1] || "";
    const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);

    const data = {};
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      if (!key || !rest.length) continue;
      data[key.trim().toLowerCase()] = rest.join("=").trim();
    }

    const platform = data.platform;
    const link = data.link;

    if (!platform || !link) {
      return bot.sendMessage(
        msg.chat.id,
        "Invalid format.\n\nUse:\n!setsocial\nplatform=tiktok\nlink=https://..."
      );
    }

    const allowed = ["tiktok", "telegram", "pinterest", "reddit"];
    if (!allowed.includes(platform)) {
      return bot.sendMessage(
        msg.chat.id,
        `Platform must be one of: ${allowed.join(", ")}`
      );
    }

    const settings = await getSettings();
    settings.socialMedia[platform] = link;
    await settings.save();

    await bot.sendMessage(
      msg.chat.id,
      `Updated ${platform} link to:\n${link}`
    );
  });
};
