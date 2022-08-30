import { EmbedBuilder } from 'discord.js'
import { TradeDto } from '../types/EventDto'
import { EtherScanTransactionLink, FN } from './common'

// DISCORD //
export function TradeDiscord(dto: TradeDto): EmbedBuilder {
  const embed = new EmbedBuilder().setColor('#0099ff').setURL(`${EtherScanTransactionLink(dto.transactionHash)}`)
  if (dto.valueIn > 0) {
    title(dto.valueIn, dto.tokenInSymbol, dto.tokenOutSymbol, embed)
    discord1(dto.amountIn, dto.tokenInSymbol, dto.valueIn, dto.tokenInEmoji, embed)
    discord2(dto.amountOut, dto.tokenOutSymbol, dto.valueOut, dto.tokenOutEmoji, embed)
  }
  embed
    .setFooter({
      iconURL: 'https://raw.githubusercontent.com/ethboi/assets/main/optimism.png',
      text: `Optimism`,
    })
    .setTimestamp()
    .setThumbnail('attachment://buffer.png')

  return embed
}

export function TradeTwitter(dto: TradeDto) {
  const post: string[] = []

  Line1(dto.valueIn, post)
  Line2(dto.amountIn, dto.tokenInSymbol, dto.valueIn, dto.tokenInEmoji, post)
  Line3(dto.amountOut, dto.tokenOutSymbol, dto.valueOut, dto.tokenOutEmoji, post)

  post.push(`🔗 ${EtherScanTransactionLink(dto.transactionHash)}\n\n`)
  post.push(`Earn yield on your crypto assets today 👇\n`)
  post.push(`https://rubicon.finance`)
  return post.join('')
}

function Line1(amountInValue: number, post: string[]) {
  post.push(`💵 $${FN(amountInValue, 2)} trade \n\n`)
}

function Line2(amountInAmount: number, tokenSymbol: string, amountInValue: number, tokenEmoji: string, post: string[]) {
  post.push(`${tokenEmoji} ${FN(amountInAmount, 2)} $${tokenSymbol} ($${FN(amountInValue, 2)}) for \n`)
}

function Line3(amountInAmount: number, tokenSymbol: string, amountInValue: number, tokenEmoji: string, post: string[]) {
  post.push(`${tokenEmoji} ${FN(amountInAmount, 2)} $${tokenSymbol} ($${FN(amountInValue, 2)})\n\n`)
}

function title(amountInValue: number, token0Symbol: string, token1Symbol: string, embed: EmbedBuilder) {
  embed.setTitle(`$${FN(amountInValue, 2)} ${token0Symbol}/${token1Symbol} Trade`)
}

function discord1(
  amountInAmount: number,
  tokenSymbol: string,
  amountInValue: number,
  tokenEmoji: string,
  embed: EmbedBuilder,
) {
  embed.addFields({
    name: `From`,
    value: `> ${tokenEmoji} ${FN(amountInAmount, 2)} $${tokenSymbol} ($${FN(amountInValue, 2)})`,
    inline: false,
  })
}
function discord2(
  amountInAmount: number,
  tokenSymbol: string,
  amountInValue: number,
  tokenEmoji: string,
  embed: EmbedBuilder,
) {
  embed.addFields({
    name: `For`,
    value: `> ${tokenEmoji} ${FN(amountInAmount, 2)} $${tokenSymbol} ($${FN(amountInValue, 2)})`,
    inline: false,
  })
}
