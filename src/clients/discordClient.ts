import { Client, GatewayIntentBits, Partials } from 'discord.js'

export const DiscordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.User, Partials.Message],
})
