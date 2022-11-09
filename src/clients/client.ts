import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { ALCHEMY_ID } from '../secrets'

export default class RpcClient {
  chainId: number
  rpcUrl: string
  provider: JsonRpcProvider

  constructor(provider: JsonRpcProvider) {
    this.chainId = provider.network.chainId
    this.provider = provider

    this.rpcUrl = ethers.providers.AlchemyProvider.getUrl(provider.network, ALCHEMY_ID).url

    console.log('Client', {
      chainId: this.chainId,
      rpcUrl: this.rpcUrl,
    })
  }
}
