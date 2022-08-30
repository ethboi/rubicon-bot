import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import { ContractType } from '../constants/contractAddresses'

export function VaultType(contractType: ContractType | null, asset: string) {
  if (contractType === ContractType.bathDAI) {
    return `🟡 $${asset}`
  }
  if (contractType === ContractType.bathETH) {
    return `🔷 $${asset}`
  }
  if (contractType === ContractType.bathOP) {
    return `🔴 $${asset}`
  }
  if (contractType === ContractType.bathSNX) {
    return `🟦 $${asset}`
  }
  if (contractType === ContractType.bathUSDC) {
    return `🔵 $${asset}`
  }
  if (contractType === ContractType.bathUSDT) {
    return `🟩 $${asset}`
  }
  if (contractType === ContractType.bathWBTC) {
    return `🟠 $${asset}`
  }
}

export function EtherScanTransactionLink(transactionHash: string) {
  return `${EtherScanUrl()}/tx/${transactionHash}`
}

export function FormattedDate(date: Date) {
  dayjs.extend(dayjsPluginUTC)
  return dayjs(date).utc().format('DD MMM YY')
}

export function FormattedDateTime(date: Date) {
  dayjs.extend(dayjsPluginUTC)
  return dayjs(date).utc().format('MMM-DD-YY HH:mm:ss') + ' UTC'
}

export function EtherScanUrl() {
  return 'https://optimistic.etherscan.io'
}

export function FN(value: number, decimals: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// formatted number signed
export function FNS(value: number, decimals: number) {
  const sign = value > 0 ? '+' : ''

  return `${sign}${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}
