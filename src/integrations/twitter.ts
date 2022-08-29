import { TwitterApi } from 'twitter-api-v2'

export async function SendTweet(tweet: string, twitterApi: TwitterApi) {
  try {
    const response = await twitterApi.v1.tweet(tweet)
    console.log(response.id)
  } catch (e: any) {
    console.log(e)
  }
}
