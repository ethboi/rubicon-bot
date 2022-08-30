import { ContractType } from '../constants/contractAddresses'
import { DAI, OP, SNX, USDC, USDT, WBTC, WETH } from '../constants/tokenIds'
import mergeImages from 'merge-images'
import { Canvas, Image } from 'canvas'

export function getPrice(contractType: ContractType | null): number {
  if (
    contractType === ContractType.bathUSDC ||
    contractType === ContractType.bathDAI ||
    contractType === ContractType.bathUSDT
  ) {
    return 1
  }

  if (contractType === ContractType.bathETH) {
    return [TOKEN_PRICES[WETH[0]]] as unknown as number
  }

  if (contractType === ContractType.bathOP) {
    return [TOKEN_PRICES[OP[0]]] as unknown as number
  }

  if (contractType === ContractType.bathSNX) {
    return [TOKEN_PRICES[SNX[0]]] as unknown as number
  }

  if (contractType === ContractType.bathWBTC) {
    return [TOKEN_PRICES[WBTC[0]]] as unknown as number
  }

  return 1
}

export function getToken(tokenAddress: string): (string | number)[] {
  if (tokenAddress === '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58') {
    return USDT
  }
  if (tokenAddress === '0x7f5c764cbc14f9669b88837ca1490cca17c31607') {
    return USDC
  }
  if (tokenAddress === '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1') {
    return DAI
  }
  if (tokenAddress === '0x68f180fcce6836688e9084f035309e29bf0a2095') {
    return WBTC
  }
  if (tokenAddress === '0x4200000000000000000000000000000000000006') {
    return WETH
  }
  if (tokenAddress === '0x8700daec35af8ff88c16bdf0418774cb3d7599b4') {
    return SNX
  }
  if (tokenAddress === '0x4200000000000000000000000000000000000042') {
    return OP
  }

  return []
}

export function tokenSymbol(tokenAddress: string) {
  if (tokenAddress === '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58') {
    return `🟩`
  }
  if (tokenAddress === '0x7f5c764cbc14f9669b88837ca1490cca17c31607') {
    return `🔵`
  }
  if (tokenAddress === '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1') {
    return `🟡`
  }
  if (tokenAddress === '0x68f180fcce6836688e9084f035309e29bf0a2095') {
    return `🟠`
  }
  if (tokenAddress === '0x4200000000000000000000000000000000000006') {
    return `🔷`
  }
  if (tokenAddress === '0x8700daec35af8ff88c16bdf0418774cb3d7599b4') {
    return `🟦`
  }
  if (tokenAddress === '0x4200000000000000000000000000000000000042') {
    return `🔴`
  }

  return ''
}

export function getTokenPrice(tokenAddress: string): number {
  return TOKEN_PRICES[getToken(tokenAddress)[0]] as unknown as number
}

const coingeckoBaseUrl = 'https://assets.coingecko.com/coins/images/'

export function getImage(contractType: ContractType | null) {
  let tokenImg = ''

  if (contractType === ContractType.bathUSDC) {
    tokenImg = USDC[3] as string
  }

  if (contractType === ContractType.bathDAI) {
    tokenImg = DAI[3] as string
  }

  if (contractType === ContractType.bathUSDT) {
    tokenImg = USDT[3] as string
  }

  if (contractType === ContractType.bathETH) {
    tokenImg = 'https://raw.githubusercontent.com/ethboi/assets/main/weth-small.png'
  }

  if (contractType === ContractType.bathOP) {
    return 'https://raw.githubusercontent.com/ethboi/assets/main/optimism.png'
  }

  if (contractType === ContractType.bathSNX) {
    tokenImg = SNX[3] as string
  }

  if (contractType === ContractType.bathWBTC) {
    tokenImg = WBTC[3] as string
  }

  return `${coingeckoBaseUrl}${tokenImg}`
}

export const getMergedThumbnail = async (arg0: (string | number)[], arg1: (string | number)[]) => {
  let token0Img = `${coingeckoBaseUrl}${arg0[3] as string}`
  let token1Img = `${coingeckoBaseUrl}${arg1[3] as string}`

  if (arg0[0] === 'optimism') {
    token0Img = 'https://raw.githubusercontent.com/ethboi/assets/main/optimism.png'
  }

  if (arg1[0] === 'optimism') {
    token1Img = 'https://raw.githubusercontent.com/ethboi/assets/main/optimism.png'
  }

  if (arg0[0] === 'weth') {
    token0Img = 'https://raw.githubusercontent.com/ethboi/assets/main/weth-small.png'
  }

  if (arg1[0] === 'weth') {
    token1Img = 'https://raw.githubusercontent.com/ethboi/assets/main/weth-small.png'
  }

  const b64 = await mergeImages(
    [
      { src: token1Img, x: 40, y: 0 },
      { src: token0Img, x: 0, y: 0 },
    ],
    { width: 100, height: 55, Canvas: Canvas, Image: Image },
  )
  const b64StrippedHeader = b64.split(';base64,').pop()
  return b64StrippedHeader
}

export function getAsset(contractType: ContractType | null) {
  let asset = '$'

  if (contractType === ContractType.bathUSDC) {
    asset = USDC[1] as string
  }

  if (contractType === ContractType.bathDAI) {
    asset = DAI[1] as string
  }

  if (contractType === ContractType.bathUSDT) {
    asset = USDT[1] as string
  }

  if (contractType === ContractType.bathETH) {
    asset = WETH[1] as string
  }

  if (contractType === ContractType.bathOP) {
    asset = OP[1] as string
  }

  if (contractType === ContractType.bathSNX) {
    asset = SNX[1] as string
  }

  if (contractType === ContractType.bathWBTC) {
    asset = WBTC[1] as string
  }

  return asset
}
