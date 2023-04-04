import { DISCORD_ACCESS_TOKEN, DISCORD_ENABLED, TELEGRAM_ENABLED, TWITTER_ENABLED } from './secrets'
import { DiscordClient } from './clients/discordClient'
import { Client } from 'discord.js'
import { TwitterApi } from 'twitter-api-v2'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TelegramClient } from './clients/telegramClient'
import { defaultActivity } from './integrations/discord'
import { alchemyProvider } from './clients/ethersClient'
import { TrackEvents } from './event/blockEvent'
import { GetPrices } from './integrations/prices'
import { PricingJob } from './schedule'
import RpcClient from './clients/client'
import { TwitterClient } from './clients/twitterClient'

let discordClient: Client<boolean>
let twitterClient: TwitterApi
let telegramClient: Telegraf<Context<Update>>

export async function Run() {
  const rpcClient = new RpcClient(alchemyProvider)
  global.ENS = {}
  global.TOKEN_PRICES = {}
  global.TOKEN_IMAGES = {}

  await GetPrices()

  await Promise.all([SetUpDiscord(), SetUpTwitter()])
  //await SetUpTelegram()

  await TrackEvents(discordClient, telegramClient, twitterClient, rpcClient)
  PricingJob()
}

export async function SetUpDiscord() {
  if (DISCORD_ENABLED) {
    discordClient = DiscordClient
    discordClient.on('ready', async (client) => {
      console.debug('Discord bot is online!')
    })
    await discordClient.login(DISCORD_ACCESS_TOKEN)
    defaultActivity(discordClient)
  }
}

export async function SetUpTwitter() {
  if (TWITTER_ENABLED) {
    twitterClient = TwitterClient
    twitterClient.readWrite
  }
}

export async function SetUpTelegram() {
  if (TELEGRAM_ENABLED) {
    telegramClient = TelegramClient
  }
}
