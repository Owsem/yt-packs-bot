import User from "../models/User.js";
import { isAdmin } from "./accessControl.js";

export const registerUsersAdmin = (bot) => {
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!isAdmin(query.from.id)) return;

    if (data === "admin_users") {
      const text =
        "👥 Users\n\n" +
        "To list recent users, use:\n`!users`\n\n" +
        "To view a specific user by Telegram ID:\n`!user 123456789`";

      await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }
  });

  // !users
  bot.onText(/!users/i, async (msg) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const users = await User.find().sort({ createdAt: -1 }).limit(30);

    if (!users.length) {
      return bot.sendMessage(msg.chat.id, "No users found.");
    }

    const lines = users.map(
      (u) =>
        `• ${u.firstName || ""} ${u.lastName || ""} (@${u.username || "none"}) – ${u.telegramId}`
    );

    await bot.sendMessage(msg.chat.id, lines.join("\n"));
  });

  // !user <telegramId>
  bot.onText(/!user (\d+)/i, async (msg, match) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const telegramId = match[1];
    const user = await User.findOne({ telegramId }).populate({
      path: "purchases",
      populate: { path: "theme" }
    });

    if (!user) {
      return bot.sendMessage(msg.chat.id, "User not found.");
    }

    const purchases =
      user.purchases && user.purchases.length
        ? user.purchases
            .map((o) =>
              o.theme ? `${o.theme.name} ($${o.theme.price})` : "Unknown pack"
            )
            .join("\n")
        : "No purchases";

    const text =
      `User: ${user.firstName || ""} ${user.lastName || ""}\n` +
      `Username: @${user.username || "none"}\n` +
      `Telegram ID: ${user.telegramId}\n\n` +
      `Purchases:\n${purchases}`;

    await bot.sendMessage(msg.chat.id, text);
  });
};
