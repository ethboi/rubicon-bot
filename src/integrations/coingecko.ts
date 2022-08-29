import { CoinGeckoClient } from '../clients/coinGeckoClient'
import { TOKEN_IDS } from '../constants/tokenIds'

export async function GetPrices(): Promise<void> {
  try {
    await CoinGeckoClient.simple.price({ ids: TOKEN_IDS as string[], vs_currencies: 'usd' }).then((resp) => {
      console.log(resp)
      TOKEN_IDS.map((token_id) => {
        try {
          const tokenPrice = resp.data[token_id].usd
          console.log(`${token_id} Token Price: ${tokenPrice}`)
          global.TOKEN_PRICES[token_id] = tokenPrice
        } catch (e) {
          console.log(e)
        }
      })
    })
  } catch (ex) {
    console.log(ex)
  }
}
