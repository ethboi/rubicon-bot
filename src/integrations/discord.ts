import { Client, MessageEmbed, TextChannel } from 'discord.js/typings/index.js'

export async function PostDiscord(embeds: MessageEmbed[], client: Client<boolean>, channelName: string) {
  try {
    const channels = client.channels.cache
      .filter((value) => (value as TextChannel)?.name == channelName)
      .map(async (channel) => {
        console.log(`found channel: ${channelName}`)
        await (channel as TextChannel).send({ embeds: embeds })
      })
  } catch (e: any) {
    console.log(e)
  }
}

export async function defaultActivity(client: Client<boolean>) {
  client.user?.setActivity(`Deposit & Withdraw`, { type: 'WATCHING' })
}
