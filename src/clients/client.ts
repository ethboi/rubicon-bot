import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { INFURA_ID_OPTIMISM } from '../secrets'

export default class RpcClient {
  chainId: number
  rpcUrl: string
  provider: JsonRpcProvider

  constructor(provider: JsonRpcProvider) {
    this.chainId = provider.network.chainId
    this.provider = provider

    this.rpcUrl = ethers.providers.InfuraProvider.getUrl(provider.network, {
      projectId: INFURA_ID_OPTIMISM,
    }).url

    console.log('Client', {
      chainId: this.chainId,
      rpcUrl: this.rpcUrl,
    })
  }
}
