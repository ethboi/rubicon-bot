import { ActivityType, AttachmentBuilder, Client, EmbedBuilder, TextChannel } from 'discord.js'

export async function PostDiscord(
  embeds: EmbedBuilder[],
  client: Client<boolean>,
  channelName: string,
  files: AttachmentBuilder[] | undefined,
) {
  try {
    const channels = client.channels.cache
      .filter((value) => (value as TextChannel)?.name == channelName)
      .map(async (channel) => {
        console.log(`found channel: ${channelName}`)
        await (channel as TextChannel).send({ embeds: embeds, files: files })
      })
  } catch (e: any) {
    console.log(e)
  }
}

export async function defaultActivity(client: Client<boolean>) {
  client.user?.setActivity(`Deposit & Withdraw`, { type: ActivityType.Watching })
}
