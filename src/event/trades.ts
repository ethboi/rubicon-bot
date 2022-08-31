import { Client, AttachmentBuilder } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { getTokenPrice, getToken, getMergedThumbnail, tokenSymbol } from './common'
import { DiscordChannels } from '../constants/discordChannels'
import { PostDiscord } from '../integrations/discord'
import { PostTelegram } from '../integrations/telegram'
import {
  TWITTER_ENABLED,
  TELEGRAM_ENABLED,
  TELEGRAM_THRESHOLD,
  DISCORD_ENABLED,
  DISCORD_THRESHOLD,
  TWITTER_THRESHOLD,
} from '../secrets'
import { TradeDto } from '../types/EventDto'
import fromBigNumber from '../utils/fromBigNumber'
import { TradeDiscord, TradeTwitter } from '../templates/trade'
import { toDate } from '../utils/utils'
import { Event as GenericEvent } from 'ethers'
import { RubiconMarket__factory } from '../contracts/typechain/factories'
import { SendTweet } from '../integrations/twitter'
import printObject from '../utils/printObject'
import RpcClient from '../clients/client'
import { LogTradeEvent } from '../contracts/typechain/RubiconMarket'

export async function TrackTrades(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  rpcClient: RpcClient,
  genericEvent: GenericEvent,
): Promise<void> {
  const event = parseEvent(genericEvent as LogTradeEvent)

  const tokenOut = getToken(event.args.pay_gem.toLowerCase())
  const tokenIn = getToken(event.args.buy_gem.toLowerCase())

  const priceOut = getTokenPrice(event.args.pay_gem.toLowerCase())
  const priceIn = getTokenPrice(event.args.buy_gem.toLowerCase())

  const amountOut = fromBigNumber(event.args.pay_amt, tokenOut[2] as number)
  const amountIn = fromBigNumber(event.args.buy_amt, tokenIn[2] as number)

  const valueIn = priceIn * amountIn
  const valueOut = priceOut * amountOut

  console.log(`Trade Value In: ${valueIn}`)
  console.log(`Trade Value Out: ${valueOut}`)

  if (valueIn >= DISCORD_THRESHOLD) {
    try {
      let timestamp = 0
      try {
        timestamp = (await rpcClient.provider.getBlock(event.blockNumber)).timestamp
      } catch (ex) {
        console.log(ex)
      }
      const img64 = (await getMergedThumbnail(tokenIn, tokenOut)) ?? ''

      const dto: TradeDto = {
        amountIn: amountIn,
        valueIn: valueIn,
        amountOut: amountOut,
        valueOut: valueOut,
        transactionHash: event.transactionHash,
        timestamp: timestamp === 0 ? toDate(Date.now()) : toDate(timestamp),
        blockNumber: event.blockNumber,
        tokenInSymbol: tokenIn[1] as string,
        tokenOutSymbol: tokenOut[1] as string,
        imageUrl: '',
        img64: img64,
        tokenInEmoji: tokenSymbol(event.args.buy_gem.toLowerCase()),
        tokenOutEmoji: tokenSymbol(event.args.pay_gem.toLowerCase()),
      }

      await BroadCast(dto, twitterClient, telegramClient, discordClient)
    } catch (ex) {
      console.log(ex)
    }
  } else {
    console.log(`Trade found: $${valueIn}, smaller than ${DISCORD_THRESHOLD} threshold.`)
  }
}

export async function BroadCast(
  dto: TradeDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  discordClient: Client<boolean>,
): Promise<void> {
  // Twitter //
  if (TWITTER_ENABLED && dto.valueIn >= TWITTER_THRESHOLD) {
    const post = TradeTwitter(dto)
    await SendTweet(post, twitterClient)
  }

  // Telegram //
  if (TELEGRAM_ENABLED && dto.valueIn >= TELEGRAM_THRESHOLD) {
    // const post = EventTelegram(dto)
    // const test = await PostTelegram(post, telegramClient)
  }

  // Discord //
  if (DISCORD_ENABLED && dto.valueIn >= 0) {
    const embed = [TradeDiscord(dto)]
    const channel = DiscordChannels.Trades
    const buffer = Buffer.from(dto.img64, 'base64')
    const att = new AttachmentBuilder(buffer, { name: 'buffer.png' })
    await PostDiscord(embed, discordClient, channel, [att])
  }
}

export function parseEvent(event: LogTradeEvent): LogTradeEvent {
  const parsedEvent = RubiconMarket__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as LogTradeEvent['args']).length > 0) {
    event.args = parsedEvent.args as LogTradeEvent['args']
  }
  return event
}
