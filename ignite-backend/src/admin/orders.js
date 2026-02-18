import Order from "../models/Order.js";
import { isAdmin } from "./accessControl.js";

export const registerOrdersAdmin = (bot) => {
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!isAdmin(query.from.id)) return;

    if (data === "admin_orders") {
      const text =
        "🛒 Orders\n\n" +
        "To list recent orders, use:\n`!orders`";

      await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }
  });

  // !orders
  bot.onText(/!orders/i, async (msg) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("user")
      .populate("theme");

    if (!orders.length) {
      return bot.sendMessage(msg.chat.id, "No orders found.");
    }

    const lines = orders.map((o) => {
      const user = o.user;
      const theme = o.theme;
      return (
        `• ${theme ? theme.name : "Unknown pack"} – ` +
        `${user ? user.telegramId : "Unknown user"} – ` +
        `${o.status} – ${o.createdAt.toISOString()}`
      );
    });

    await bot.sendMessage(msg.chat.id, lines.join("\n"));
  });
};
