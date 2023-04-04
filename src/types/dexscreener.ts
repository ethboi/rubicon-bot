export type Dexscreener = {
  pairs: Pair[]
}

export type Pair = {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: EToken
  quoteToken: EToken
  priceNative: string
  priceUsd: string
  txns: Txns
  volume: PriceChange
  priceChange: PriceChange
  liquidity: Liquidity
  fdv: number
  pairCreatedAt: number
}

export type EToken = {
  address: string
  name: string
  symbol: string
}

export type Liquidity = {
  usd: number
  base: number
  quote: number
}

export type PriceChange = {
  h24: number
  h6: number
  h1: number
  m5: number
}

export type Txns = {
  h24: H1
  h6: H1
  h1: H1
  m5: H1
}

export type H1 = {
  buys: number
  sells: number
}
