# Telegram bot starter

A Telegram bot that deploys to [Dockhold](https://dockhold.eu) with zero config.
It runs as an always-on worker (long polling), echoes messages, and serves a
small status page on its URL. Add your token and it's live.

[![Deploy to Dockhold](https://img.shields.io/badge/Deploy%20to-Dockhold-2563eb?style=for-the-badge)](https://app.dockhold.eu/new?repo=https://github.com/dockhold/telegram-bot-starter)

## Deploy it

1. In Telegram, message [@BotFather](https://t.me/BotFather), send `/newbot`, and
   copy the **token** it gives you.
2. Click **Use this template** (or fork this repo) and
   [deploy it](https://app.dockhold.eu/new?repo=https://github.com/dockhold/telegram-bot-starter).
3. In the dashboard, add `BOT_TOKEN` (use the **Vault** — it's a secret) and
   restart.
4. Message your bot on Telegram. `/start`, `/help`, or any text — it echoes back.

The app's URL shows a small status page; the bot itself talks to Telegram
directly, so you don't need to open or share that URL.

## Make it yours

Edit [`index.js`](index.js) — add commands and handlers with
[Telegraf](https://telegraf.js.org):

```js
bot.command("ping", (ctx) => ctx.reply("pong"));
bot.hears("hello", (ctx) => ctx.reply("hi there"));
```

Keep secrets (API keys the bot uses) in the Vault and read them from
`process.env`.

## Notes

- **One instance.** Long polling must run as a single replica — don't scale it
  up, or updates get handled twice.
- **High volume?** Switch to webhook mode: have Telegram POST updates to your
  app's `https://<your-app>.dockhold.app/` URL on `$PORT` instead of polling.
- **Discord?** Same shape — swap Telegraf for `discord.js`, set a `DISCORD_TOKEN`,
  and keep the health server. The deploy steps are identical.

## Run it locally

```bash
npm install
BOT_TOKEN=your-token PORT=3000 npm start
```

## Full walkthrough

[Deploy a Telegram bot](https://dockhold.eu/docs/recipes/deploy-a-telegram-bot) —
the step-by-step recipe.
