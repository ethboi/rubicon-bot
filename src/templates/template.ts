import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs/plugin/utc'
import { EmbedBuilder } from 'discord.js'
import { EventDto } from '../types/EventDto'
import { ContractType } from '../constants/contractAddresses'
import { EventType } from '../constants/eventType'

// DISCORD //
export function EventDiscord(dto: EventDto): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setURL(`${EtherScanTransactionLink(dto.transactionHash)}`)
    .setThumbnail(dto.image ?? '')
    .setTitle(
      `$${FN(dto.value, 2)} ${dto.eventType === EventType.Deposit ? 'Deposit' : 'Withdraw'}: $${dto.asset} Pool  `,
    )
    .addFields(
      {
        name: '🏦 Amount',
        value: `> ${
          dto.contractType === ContractType.bathWBTC || dto.contractType === ContractType.bathETH
            ? FN(dto.amt, 4)
            : FN(dto.amt, 2)
        }`,
        inline: false,
      },
      {
        name: '🪙 Asset',
        value: `> ${dto.asset}`,
        inline: false,
      },
      {
        name: '💵 Value (USD)',
        value: `> $${FN(dto.value, 2)}`,
        inline: false,
      },
      {
        name: '👨 User',
        value: `> ${dto.ens ? dto.ens : dto.user}`,
        inline: false,
      },
    )
    .setFooter({
      iconURL: 'https://raw.githubusercontent.com/ethboi/assets/main/optimism.png',
      text: `Optimism`,
    })
    .setTimestamp()

  return embed
}

export function EventTelegram(dto: EventDto) {
  const post: string[] = []
  return post.join('')
}

export function DepositWithdrawTwitter(dto: EventDto) {
  const post: string[] = []
  post.push(
    `💵 $${FN(dto.value, 2)}${
      dto.contractType === ContractType.bathETH ||
      dto.contractType === ContractType.bathOP ||
      dto.contractType === ContractType.bathSNX ||
      dto.contractType === ContractType.bathWBTC
        ? ' (' + FN(dto.amt, 2) + ' $' + dto.asset + ')'
        : ''
    } Deposit \n\n`,
  )
  post.push(`from 🧑 ${dto.ens ? dto.ens : dto.user}\n`)
  post.push(`to ${VaultType(dto.contractType, dto.asset)} Pool\n\n`)
  post.push(`🔗 ${EtherScanTransactionLink(dto.transactionHash)}\n\n`)
  post.push(`Earn yield on your crypto assets today 👇\n`)
  post.push(`https://app.rubicon.finance/`)
  return post.join('')
}

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
