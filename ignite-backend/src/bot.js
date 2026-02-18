import TelegramBot from "node-telegram-bot-api";
import { registerStartCommand } from "./commands/start.js";
import { registerPacksCommand } from "./commands/packs.js";
import { registerBuyHandler } from "./commands/buy.js";
import { registerHelpCommand } from "./commands/help.js";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is not defined");
}

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot is running with polling...");

// Register commands
registerStartCommand(bot);
registerPacksCommand(bot);
registerBuyHandler(bot);
registerHelpCommand(bot);

export default bot;
