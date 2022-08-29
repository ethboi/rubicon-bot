import { ContractType } from '../constants/contractAddresses'
import { DAI, OP, SNX, USDC, USDT, WBTC, WETH } from '../constants/tokenIds'

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

export function getImage(contractType: ContractType | null) {
  const coingeckoBaseUrl = 'https://assets.coingecko.com/coins/images/'

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
    tokenImg = WETH[3] as string
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

export function getContractType(contractAddress: string): ContractType | null {
  switch (contractAddress) {
    case ContractType.bathDAI:
      return ContractType.bathDAI
    case ContractType.bathETH:
      return ContractType.bathETH
    case ContractType.bathOP:
      return ContractType.bathOP
    case ContractType.bathSNX:
      return ContractType.bathSNX
    case ContractType.bathUSDC:
      return ContractType.bathUSDC
    case ContractType.bathUSDT:
      return ContractType.bathUSDT
    case ContractType.bathWBTC:
      return ContractType.bathWBTC
  }
  return null
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
