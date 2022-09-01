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
  TESTNET,
} from '../secrets'
import { TradeDto } from '../types/EventDto'
import fromBigNumber from '../utils/fromBigNumber'
import { TradeDiscord, TradeTwitter } from '../templates/trade'
import { groupBy, toDate } from '../utils/utils'
import { BigNumber, Event as GenericEvent } from 'ethers'
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
  genericEvents: GenericEvent[],
): Promise<void> {
  try {
    const events = parseEvents(genericEvents as LogTradeEvent[])

    // group the events by tokenIn / token Out Pairs
    const groupedEvents = groupBy(events, (i) => i.args.buy_gem + '_' + i.args.pay_gem)
    // printObject(groupedEvents)

    const firstKey = Object.keys(groupedEvents)[0]
    const lastKey = Object.keys(groupedEvents)[Object.keys(groupedEvents).length - 1]

    const tokenInAddress = groupedEvents[firstKey][0].args.buy_gem.toLowerCase()
    const tokenOutAddress = groupedEvents[lastKey][0].args.pay_gem.toLowerCase()

    const tokenIn = getToken(tokenInAddress)
    const tokenOut = getToken(tokenOutAddress)

    const priceIn = getTokenPrice(tokenInAddress)
    const priceOut = getTokenPrice(tokenOutAddress)

    const amountIn = aggregateTrades(groupedEvents[firstKey]).amountIn
    const amountOut = aggregateTrades(groupedEvents[lastKey]).amountOut

    const valueIn = priceIn * amountIn
    const valueOut = priceOut * amountOut

    console.log(`Trade Value In: ${valueIn}`)
    console.log(`Trade Value Out: ${valueOut}`)

    if (valueIn >= DISCORD_THRESHOLD) {
      try {
        let timestamp = 0
        try {
          timestamp = (await rpcClient.provider.getBlock(events[0].blockNumber)).timestamp
        } catch (ex) {
          console.log(ex)
        }
        const img64 = (await getMergedThumbnail(tokenIn, tokenOut)) ?? ''

        const dto: TradeDto = {
          amountIn: amountIn,
          valueIn: valueIn,
          amountOut: amountOut,
          valueOut: valueOut,
          transactionHash: events[0].transactionHash,
          timestamp: timestamp === 0 ? toDate(Date.now()) : toDate(timestamp),
          blockNumber: events[0].blockNumber,
          tokenInSymbol: tokenIn[1] as string,
          tokenOutSymbol: tokenOut[1] as string,
          imageUrl: '',
          img64: img64,
          tokenInEmoji: tokenSymbol(events[0].args.buy_gem.toLowerCase()),
          tokenOutEmoji: tokenSymbol(events[0].args.pay_gem.toLowerCase()),
        }

        await BroadCast(dto, twitterClient, telegramClient, discordClient)
      } catch (ex) {
        console.log(ex)
      }
    } else {
      console.log(`Trade found: $${valueIn}, smaller than ${DISCORD_THRESHOLD} threshold.`)
    }
  } catch (ex) {
    console.log(ex)
  }
}

export function aggregateTrades(events: LogTradeEvent[]): { amountIn: number; amountOut: number } {
  const amounts = events.reduce(
    (amounts, item) => {
      const tokenOut = getToken(item.args.pay_gem.toLowerCase())
      const tokenIn = getToken(item.args.buy_gem.toLowerCase())
      const amountOut = fromBigNumber(item.args.pay_amt, tokenOut[2] as number)
      const amountIn = fromBigNumber(item.args.buy_amt, tokenIn[2] as number)

      amounts.amountIn += amountIn
      amounts.amountOut += amountOut
      return amounts
    },
    {
      amountIn: 0,
      amountOut: 0,
    },
  )
  return amounts
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
    if (TESTNET) {
      console.log(post)
    } else {
      await SendTweet(post, twitterClient)
    }
  }

  // Telegram //
  if (TELEGRAM_ENABLED && dto.valueIn >= TELEGRAM_THRESHOLD) {
    // const post = EventTelegram(dto)
    // const test = await PostTelegram(post, telegramClient)
  }

  // Discord //
  if (DISCORD_ENABLED && dto.valueIn >= DISCORD_THRESHOLD) {
    const embed = [TradeDiscord(dto)]
    const channel = DiscordChannels.Trades
    const buffer = Buffer.from(dto.img64, 'base64')
    const att = new AttachmentBuilder(buffer, { name: 'buffer.png' })
    if (TESTNET) {
      printObject(embed)
    } else {
      await PostDiscord(embed, discordClient, channel, [att])
    }
  }
}

export function parseEvents(events: LogTradeEvent[]): LogTradeEvent[] {
  const result = events.map((x) => {
    const parsedEvent = RubiconMarket__factory.createInterface().parseLog(x)
    if ((parsedEvent.args as LogTradeEvent['args']).length > 0) {
      x.args = parsedEvent.args as LogTradeEvent['args']
    }
    return x
  })

  return result
}
