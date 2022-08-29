import { Client, Intents } from 'discord.js'

export const DiscordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ['USER', 'MESSAGE'],
})
