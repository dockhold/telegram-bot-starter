const express = require("express");
const { Telegraf } = require("telegraf");

// --- Health server on the assigned port ---
// A bot mostly talks *out* to Telegram, but Dockhold gives every app a URL, so
// we serve a small status page on $PORT. It also satisfies any health check and
// gives you something to hit instead of a 502.
const app = express();
app.get("/", (_req, res) =>
  res.json({
    status: "ok",
    bot: process.env.BOT_TOKEN ? "running" : "idle — set BOT_TOKEN",
    docs: "https://dockhold.eu/docs/recipes/deploy-a-telegram-bot",
  })
);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`health server listening on ${port}`));

// --- The bot ---
const token = process.env.BOT_TOKEN;
if (!token) {
  console.warn("BOT_TOKEN is not set — get one from @BotFather, add it in the dashboard (Vault), and restart. The bot stays idle until then.");
} else {
  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply("Hi! I'm running on Dockhold. Send me anything and I'll echo it back."));
  bot.help((ctx) => ctx.reply("Commands:\n/start – say hello\n/help – this message\nOr just send any text."));
  bot.on("text", (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

  // Long polling — no public webhook to configure. Single instance only (don't
  // scale a polling bot past one replica, or updates get processed twice).
  bot.launch().then(
    () => console.log("Telegram bot started (long polling)"),
    (err) => console.error("bot launch failed — check BOT_TOKEN:", err.message)
  );

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
