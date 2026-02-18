import TelegramBot from "node-telegram-bot-api";
import { registerStartCommand } from "./commands/start.js";
import { registerPacksCommand } from "./commands/packs.js";
import { registerBuyHandler } from "./commands/buy.js";
import { registerHelpCommand } from "./commands/help.js";

// ADMIN
import { registerAdminMenu } from "./admin/adminMenu.js";
import { registerSocialMediaAdmin } from "./admin/socialMedia.js";
import { registerPackManagerAdmin } from "./admin/packManager.js";
import { registerBroadcastAdmin } from "./admin/broadcast.js";
import { registerStatsAdmin } from "./admin/stats.js";
import { registerUsersAdmin } from "./admin/users.js";
import { registerOrdersAdmin } from "./admin/orders.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is missing");

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot is running...");

// User commands
registerStartCommand(bot);
registerPacksCommand(bot);
registerBuyHandler(bot);
registerHelpCommand(bot);

// Admin modules
registerAdminMenu(bot);
registerSocialMediaAdmin(bot);
registerPackManagerAdmin(bot);
registerBroadcastAdmin(bot);
registerStatsAdmin(bot);
registerUsersAdmin(bot);
registerOrdersAdmin(bot);

export default bot;
