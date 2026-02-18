import Theme from "../models/Theme.js";
import { isAdmin } from "./accessControl.js";

const parseKeyValueBlock = (text) => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const data = {};
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (!key || !rest.length) continue;
    data[key.trim().toLowerCase()] = rest.join("=").trim();
  }
  return data;
};

export const registerPackManagerAdmin = (bot) => {
  // Admin panel button: "📦 Manage Packs"
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (!isAdmin(query.from.id)) return;

    if (data === "admin_packs") {
      const text =
        "📦 Pack Manager\n\n" +
        "Commands:\n\n" +
        "**Add pack:**\n" +
        "`!addpack`\n" +
        "name=Your Pack Name\nslug=yourpackslug\nprice=15\nfile=https://...\n" +
        "description=Optional description\n\n" +
        "**Edit pack:**\n" +
        "`!editpack`\nslug=yourpackslug\nname=New Name\nprice=20\n...\n\n" +
        "**Delete pack:**\n" +
        "`!deletepack`\nslug=yourpackslug\n\n" +
        "**Toggle active:**\n" +
        "`!togglepack`\nslug=yourpackslug\n\n" +
        "**List packs:**\n" +
        "`!listpacks`";

      await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }
  });

  // !addpack
  bot.onText(/!addpack([\s\S]*)/i, async (msg, match) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const body = (match[1] || "").trim();
    const data = parseKeyValueBlock(body);

    const { name, slug, price, file, description } = data;

    if (!name || !slug || !price || !file) {
      return bot.sendMessage(
        msg.chat.id,
        "Missing fields.\nRequired: name, slug, price, file\nOptional: description"
      );
    }

    const existing = await Theme.findOne({ slug });
    if (existing) {
      return bot.sendMessage(msg.chat.id, "A pack with this slug already exists.");
    }

    const priceNumber = Number(price);
    if (isNaN(priceNumber)) {
      return bot.sendMessage(msg.chat.id, "Price must be a number.");
    }

    await Theme.create({
      name,
      slug,
      price: priceNumber,
      fileUrl: file,
      description: description || "",
      isActive: true
    });

    await bot.sendMessage(msg.chat.id, `Pack "${name}" added successfully.`);
  });

  // !editpack
  bot.onText(/!editpack([\s\S]*)/i, async (msg, match) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const body = (match[1] || "").trim();
    const data = parseKeyValueBlock(body);

    const { slug } = data;
    if (!slug) {
      return bot.sendMessage(msg.chat.id, "You must provide slug to edit a pack.");
    }

    const theme = await Theme.findOne({ slug });
    if (!theme) {
      return bot.sendMessage(msg.chat.id, "Pack not found.");
    }

    if (data.name) theme.name = data.name;
    if (data.price) {
      const priceNumber = Number(data.price);
      if (isNaN(priceNumber)) {
        return bot.sendMessage(msg.chat.id, "Price must be a number.");
      }
      theme.price = priceNumber;
    }
    if (data.file) theme.fileUrl = data.file;
    if (data.description) theme.description = data.description;

    await theme.save();

    await bot.sendMessage(msg.chat.id, `Pack "${theme.name}" updated.`);
  });

  // !deletepack
  bot.onText(/!deletepack([\s\S]*)/i, async (msg, match) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const body = (match[1] || "").trim();
    const data = parseKeyValueBlock(body);
    const { slug } = data;

    if (!slug) {
      return bot.sendMessage(msg.chat.id, "You must provide slug to delete a pack.");
    }

    const theme = await Theme.findOneAndDelete({ slug });
    if (!theme) {
      return bot.sendMessage(msg.chat.id, "Pack not found.");
    }

    await bot.sendMessage(msg.chat.id, `Pack "${theme.name}" deleted.`);
  });

  // !togglepack
  bot.onText(/!togglepack([\s\S]*)/i, async (msg, match) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const body = (match[1] || "").trim();
    const data = parseKeyValueBlock(body);
    const { slug } = data;

    if (!slug) {
      return bot.sendMessage(msg.chat.id, "You must provide slug to toggle a pack.");
    }

    const theme = await Theme.findOne({ slug });
    if (!theme) {
      return bot.sendMessage(msg.chat.id, "Pack not found.");
    }

    theme.isActive = !theme.isActive;
    await theme.save();

    await bot.sendMessage(
      msg.chat.id,
      `Pack "${theme.name}" is now ${theme.isActive ? "ACTIVE" : "INACTIVE"}.`
    );
  });

  // !listpacks
  bot.onText(/!listpacks/i, async (msg) => {
    if (!isAdmin(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "You are not authorized to do this.");
    }

    const themes = await Theme.find().sort({ createdAt: -1 });

    if (!themes.length) {
      return bot.sendMessage(msg.chat.id, "No packs found.");
    }

    const lines = themes.map(
      (t) =>
        `• ${t.name} (${t.slug}) – $${t.price} – ${t.isActive ? "ACTIVE" : "INACTIVE"}`
    );

    await bot.sendMessage(msg.chat.id, lines.join("\n"));
  });
};
