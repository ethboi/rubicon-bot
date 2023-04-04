import { ContractType } from '../constants/contractAddresses'
import mergeImages from 'merge-images'
import { Canvas, Image } from 'canvas'
import { WETH, OP, SNX, WBTC, USDC, TOKENS, DAI, USDT, TOKEN } from '../constants/tokenIds'

export function GetPrice(token: TOKEN): number {
  return TOKEN_PRICES[token.address.toLowerCase()]
}

export function TokenSymbol(tokenAddress: string) {
  if (tokenAddress.toLowerCase() === USDT) {
    return `🟩`
  }
  if (tokenAddress.toLowerCase() === USDC) {
    return `🔵`
  }
  if (tokenAddress.toLowerCase() === DAI) {
    return `🟡`
  }
  if (tokenAddress.toLowerCase() === WBTC) {
    return `🟠`
  }
  if (tokenAddress.toLowerCase() === WETH) {
    return `🔷`
  }
  if (tokenAddress.toLowerCase() === SNX) {
    return `🟦`
  }
  if (tokenAddress.toLowerCase() === OP) {
    return `🔴`
  }

  return ''
}

export function GetToken(contractType: ContractType) {
  if (contractType === ContractType.bathUSDC) {
    return TOKENS[USDC]
  }

  if (contractType === ContractType.bathDAI) {
    return TOKENS[DAI]
  }

  if (contractType === ContractType.bathUSDT) {
    return TOKENS[USDT]
  }

  if (contractType === ContractType.bathETH) {
    return TOKENS[WETH]
  }

  if (contractType === ContractType.bathOP) {
    return TOKENS[OP]
  }

  if (contractType === ContractType.bathSNX) {
    return TOKENS[SNX]
  }

  if (contractType === ContractType.bathWBTC) {
    return TOKENS[WBTC]
  }

  return undefined
}

export const GetMergedThumbnail = async (token0: TOKEN, token1: TOKEN) => {
  const b64 = await mergeImages(
    [
      { src: token0.logo, x: 40, y: 0 },
      { src: token1.logo, x: 0, y: 0 },
    ],
    { width: 100, height: 55, Canvas: Canvas, Image: Image },
  )
  const b64StrippedHeader = b64.split(';base64,').pop()
  return b64StrippedHeader
}
