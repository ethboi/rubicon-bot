import { Client } from 'discord.js'
import { Telegraf, Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { GetToken, GetPrice } from './common'
import { DiscordChannels } from '../constants/discordChannels'
import { EventType } from '../constants/eventType'
import { PostDiscord } from '../integrations/discord'
import { GetEns } from '../integrations/ens'
import { DISCORD_ENABLED, DISCORD_THRESHOLD, TESTNET } from '../secrets'
import { EventDto } from '../types/EventDto'
import fromBigNumber from '../utils/fromBigNumber'
import { DepositWithdrawDiscord } from '../templates/depositwithdraw'
import { toDate } from '../utils/utils'
import { Event as GenericEvent } from 'ethers'
import { LogWithdrawEvent } from '../contracts/typechain/BathToken'
import { BathToken__factory } from '../contracts/typechain'
import { ContractType } from '../constants/contractAddresses'
import RpcClient from '../clients/client'
import printObject from '../utils/printObject'
import { TwitterApi } from 'twitter-api-v2'

export async function TrackWithdraws(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  rpcClient: RpcClient,
  genericEvent: GenericEvent,
): Promise<void> {
  const event = parseEvent(genericEvent as LogWithdrawEvent)
  const contractType = event.address.toLowerCase() as unknown as ContractType
  const token = GetToken(contractType)
  if (!token) {
    return
  }

  const price = GetPrice(token)
  const amt = fromBigNumber(event.args.amountWithdrawn, token.decimals)
  const value = price * amt

  console.log(`Withdraw Value: ${value}`)
  if (value >= Number(DISCORD_THRESHOLD)) {
    try {
      let timestamp = 0
      try {
        timestamp = (await rpcClient.provider.getBlock(event.blockNumber)).timestamp
      } catch (ex) {
        console.log(ex)
      }

      const dto: EventDto = {
        eventType: EventType.Withdraw,
        user: event.args.withdrawer,
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
        ens: await GetEns(event.args.withdrawer),
      }

      await BroadCast(dto, twitterClient, telegramClient, discordClient)
    } catch (ex) {
      console.log(ex)
    }
  } else {
    console.log(`Withdraw found: $${value}, smaller than ${DISCORD_THRESHOLD} threshold.`)
  }
}

export function parseEvent(event: LogWithdrawEvent): LogWithdrawEvent {
  const parsedEvent = BathToken__factory.createInterface().parseLog(event)

  if ((parsedEvent.args as LogWithdrawEvent['args']).length > 0) {
    event.args = parsedEvent.args as LogWithdrawEvent['args']
  }
  return event
}

export async function BroadCast(
  dto: EventDto,
  twitterClient: TwitterApi,
  telegramClient: Telegraf<Context<Update>>,
  discordClient: Client<boolean>,
): Promise<void> {
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
