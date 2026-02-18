import User from "../models/User.js";
import Order from "../models/Order.js";
import Theme from "../models/Theme.js";
import { isAdmin } from "./accessControl.js";

export const registerStatsAdmin = (bot) => {
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!isAdmin(query.from.id)) return;

    if (data === "admin_stats") {
      const totalUsers = await User.countDocuments();
      const totalOrders = await Order.countDocuments();

      const orders = await Order.find().populate("theme");
      let totalRevenue = 0;
      const themeCount = {};

      for (const order of orders) {
        if (order.theme && order.theme.price) {
          totalRevenue += order.theme.price;
          const slug = order.theme.slug;
          themeCount[slug] = (themeCount[slug] || 0) + 1;
        }
      }

      let mostSoldText = "No data";
      if (Object.keys(themeCount).length) {
        const topSlug = Object.entries(themeCount).sort(
          (a, b) => b[1] - a[1]
        )[0][0];
        const topTheme = await Theme.findOne({ slug: topSlug });
        if (topTheme) {
          mostSoldText = `${topTheme.name} (${topTheme.slug}) – ${themeCount[topSlug]} sales`;
        }
      }

      const text =
        "📊 Bot Statistics\n\n" +
        `Total users: ${totalUsers}\n` +
        `Total orders: ${totalOrders}\n` +
        `Estimated revenue: $${totalRevenue}\n` +
        `Most sold pack: ${mostSoldText}`;

      await bot.sendMessage(chatId, text);
    }
  });
};
