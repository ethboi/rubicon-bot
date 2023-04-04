import { Client } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { GetPrice, GetToken } from './common'
import { DiscordChannels } from '../constants/discordChannels'
import { EventType } from '../constants/eventType'
import { PostDiscord } from '../integrations/discord'
import { GetEns } from '../integrations/ens'
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
import { EventDto } from '../types/EventDto'
import fromBigNumber from '../utils/fromBigNumber'
import { DepositWithdrawDiscord, DepositWithdrawTwitter } from '../templates/depositwithdraw'
import { toDate } from '../utils/utils'
import { Event as GenericEvent } from 'ethers'
import { LogDepositEvent } from '../contracts/typechain/BathToken'
import { BathToken__factory } from '../contracts/typechain/factories'
import { SendTweet } from '../integrations/twitter'
import printObject from '../utils/printObject'
import { ContractType } from '../constants/contractAddresses'
import RpcClient from '../clients/client'

export async function TrackDeposits(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  rpcClient: RpcClient,
  genericEvent: GenericEvent,
): Promise<void> {
  const event = parseEvent(genericEvent as LogDepositEvent)
  const contractType = event.address.toLowerCase() as unknown as ContractType
  const token = GetToken(contractType)

  if (!token) {
    return
  }

  const price = GetPrice(token)
  const amt = fromBigNumber(event.args.depositedAmt, token.decimals)
  const value = price * amt

  console.log(`Deposit Value: ${value}`)
  if (value >= Number(DISCORD_THRESHOLD)) {
    try {
      let timestamp = 0
      try {
        timestamp = (await rpcClient.provider.getBlock(event.blockNumber)).timestamp
      } catch (ex) {
        console.log(ex)
      }

      const dto: EventDto = {
        eventType: EventType.Deposit,
        user: event.args.depositor,
        asset: token.asset,
        amt: amt,
        transactionHash: event.transactionHash,
        contractAddress: event.address,
        contractType: contractType,
        image: token.logo,
        blockNumber: event.blockNumber,
        timestamp: toDate(timestamp),
        price: price,
        value: value,
        ens: await GetEns(event.args.depositor),
      }

      await BroadCast(dto, twitterClient, telegramClient, discordClient)
    } catch (ex) {
      console.log(ex)
    }
  } else {
    console.log(`Deposit found: $${value}, smaller than ${DISCORD_THRESHOLD} threshold.`)
  }
}

export async function BroadCast(
  dto: EventDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  discordClient: Client<boolean>,
): Promise<void> {
  // Twitter //
  if (TWITTER_ENABLED && dto.value >= Number(TWITTER_THRESHOLD)) {
    const post = DepositWithdrawTwitter(dto)
    if (TESTNET) {
      console.log(post)
    } else {
      await SendTweet(post, twitterClient)
    }
  }

  // Discord //
  if (DISCORD_ENABLED && dto.value >= Number(DISCORD_THRESHOLD)) {
    const embed = [DepositWithdrawDiscord(dto)]
    const channel = dto.eventType === EventType.Deposit ? DiscordChannels.Deposit : DiscordChannels.Withdrawal
    if (TESTNET) {
      printObject(embed)
    } else {
      await PostDiscord(embed, discordClient, channel, [])
    }
  }
}

export function parseEvent(event: LogDepositEvent): LogDepositEvent {
  const parsedEvent = BathToken__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as LogDepositEvent['args']).length > 0) {
    event.args = parsedEvent.args as LogDepositEvent['args']
  }
  return event
}
