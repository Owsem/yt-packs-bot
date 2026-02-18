import { isAdmin } from "./accessControl.js";

export const registerAdminMenu = (bot) => {
  bot.onText(/!admin/, async (msg) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to access this panel.");
    }

    await bot.sendMessage(msg.chat.id, "🛠 Admin Panel", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📦 Manage Packs", callback_data: "admin_packs" }],
          [{ text: "🌐 Social Media", callback_data: "admin_social" }],
          [{ text: "📣 Broadcast", callback_data: "admin_broadcast" }],
          [{ text: "📊 Stats", callback_data: "admin_stats" }],
          [{ text: "👥 Users", callback_data: "admin_users" }],
          [{ text: "🛒 Orders", callback_data: "admin_orders" }],
          [{ text: "⬅️ Exit", callback_data: "admin_exit" }]
        ]
      }
    });
  });

  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!isAdmin(query.from.id)) {
      return bot.sendMessage(chatId, "You are not authorized to access this panel.");
    }

    if (data === "admin_exit") {
      return bot.sendMessage(chatId, "Exited admin panel.");
    }

    // Other modules will handle:
    // admin_packs
    // admin_social
    // admin_broadcast
    // admin_stats
    // admin_users
    // admin_orders
  });
};
