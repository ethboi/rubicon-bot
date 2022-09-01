import { TESTNET } from '../secrets'
import { Client } from 'discord.js'
import { BlockEvent } from '../event'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TwitterApi } from 'twitter-api-v2'
import { LOG_DEPOSIT, LOG_TRADE, LOG_WITHDRAW } from '../constants/topics'
import { CONTRACT_ADDRESSES } from '../constants/contractAddresses'
import { TrackDeposits } from './deposit'
import { TrackWithdraws } from './withdraw'
import RpcClient from '../clients/client'
import { TrackTrades } from './trades'

export async function TrackEvents(
  discordClient: Client<boolean>,
  telegramClient: Telegraf<Context<Update>>,
  twitterClient: TwitterApi,
  rpcClient: RpcClient,
): Promise<void> {
  console.log('### Polling Events ###')
  let blockNumber: number | undefined = undefined
  if (TESTNET) {
    blockNumber = rpcClient.provider.blockNumber - 10000
  }

  BlockEvent.on(
    rpcClient,
    async (event) => {
      if (event[0].topics[0].toLowerCase() === LOG_DEPOSIT) {
        await TrackDeposits(discordClient, telegramClient, twitterClient, rpcClient, event[0])
      }
      if (event[0].topics[0].toLowerCase() === LOG_WITHDRAW) {
        await TrackWithdraws(discordClient, telegramClient, twitterClient, rpcClient, event[0])
      }
      if (event[0].topics[0].toLowerCase() === LOG_TRADE) {
        await TrackTrades(discordClient, telegramClient, twitterClient, rpcClient, event)
      }
    },
    {
      startBlockNumber: blockNumber,
      addresses: CONTRACT_ADDRESSES,
      topics: [LOG_TRADE, LOG_WITHDRAW, LOG_DEPOSIT],
    },
  )
}
