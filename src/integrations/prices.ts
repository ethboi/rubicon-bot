import axios from 'axios'
import { urls } from '../constants/urls'
import { Dexscreener } from '../types/dexscreener'
import { TOKENS } from '../constants/tokenIds'

export async function GetPrices(): Promise<void> {
  try {
    const addresses = Object.keys(TOKENS)
    addresses.map(async (address) => {
      const dexscreenerData = (await axios.get(`${urls.dexscreenerUrl}${address}`)).data as Dexscreener
      const pair = dexscreenerData.pairs.find((pair) => pair.baseToken.address.toLowerCase() == address.toLowerCase())
      if (pair) {
        global.TOKEN_PRICES[address.toLowerCase()] = Number(pair.priceUsd)
      } else {
        console.log(`Pair not found: ${address.toLowerCase()}`)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
