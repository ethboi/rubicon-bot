import { ContractType } from '../constants/contractAddresses'
import { EventType } from '../constants/eventType'

export type EventDto = {
  eventType: EventType
  asset: string
  amt: number
  user: string
  transactionHash: string
  contractAddress: string
  contractType: ContractType | null
  image: string | null
  blockNumber: number
  timestamp: Date
  price: number
  value: number
  ens: string
}

export type BaseDto = {
  transactionHash: string
  timestamp: Date
  blockNumber: number
}

export type TradeDto = BaseDto & {
  tokenInSymbol: string
  tokenOutSymbol: string
  amountIn: number
  valueIn: number
  amountOut: number
  valueOut: number
  imageUrl: string
  img64: string
  tokenInEmoji: string
  tokenOutEmoji: string
}
