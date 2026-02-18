import User from "../models/User.js";
import { isAdmin } from "./accessControl.js";

export const registerBroadcastAdmin = (bot) => {
  // Admin panel button: "📣 Broadcast"
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!isAdmin(query.from.id)) return;

    if (data === "admin_broadcast") {
      const text =
        "📣 Broadcast\n\n" +
        "To send a text broadcast to all users, use:\n\n" +
        "`!broadcast Your message here...`";

      await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }
  });

  // !broadcast
  bot.onText(/!broadcast (.+)/i, async (msg, match) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const message = match[1].trim();
    if (!message) {
      return bot.sendMessage(msg.chat.id, "Broadcast message cannot be empty.");
    }

    const users = await User.find({}, { telegramId: 1 });

    await bot.sendMessage(
      msg.chat.id,
      `Broadcast started to ${users.length} users.`
    );

    for (const user of users) {
      try {
        await bot.sendMessage(user.telegramId, message);
      } catch (err) {
        console.error("Failed to send to", user.telegramId, err.message);
      }
    }

    await bot.sendMessage(msg.chat.id, "Broadcast finished.");
  });
};
