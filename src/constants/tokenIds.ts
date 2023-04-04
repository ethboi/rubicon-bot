export type TOKEN = {
  address: string
  asset: string
  decimals: number
  logo: string
}

const baseAddress = 'https://raw.githubusercontent.com/ethboi/assets/main'

export const USDC = '0x7f5c764cbc14f9669b88837ca1490cca17c31607'
export const DAI = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
export const WETH = '0x4200000000000000000000000000000000000006'
export const OP = '0x4200000000000000000000000000000000000042'
export const SNX = '0x8700daec35af8ff88c16bdf0418774cb3d7599b4'
export const WBTC = '0x68f180fcce6836688e9084f035309e29bf0a2095'
export const USDT = '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58'

export const TOKENS: { [key: string]: TOKEN } = {
  '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
    address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    asset: 'USDC',
    decimals: 6,
    logo: `https://raw.githubusercontent.com/ethboi/assets/main/usdc.png`,
  },
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
    address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    asset: 'DAI',
    decimals: 18,
    logo: `https://raw.githubusercontent.com/ethboi/assets/main/dai.png`,
  },
  '0x4200000000000000000000000000000000000042': {
    address: '0x4200000000000000000000000000000000000042',
    asset: 'OP',
    decimals: 18,
    logo: `https://raw.githubusercontent.com/ethboi/assets/main/optimism.png`,
  },
  '0x4200000000000000000000000000000000000006': {
    address: '0x4200000000000000000000000000000000000006',
    asset: 'WETH',
    decimals: 18,
    logo: `https://raw.githubusercontent.com/ethboi/assets/main/weth-small.png`,
  },
  '0x8700daec35af8ff88c16bdf0418774cb3d7599b4': {
    address: '0x8700daec35af8ff88c16bdf0418774cb3d7599b4',
    asset: 'SNX',
    decimals: 18,
    logo: `https://raw.githubusercontent.com/ethboi/assets/main/synthetix-icon.png`,
  },
  '0x68f180fcce6836688e9084f035309e29bf0a2095': {
    address: '0x68f180fcce6836688e9084f035309e29bf0a2095',
    asset: 'WBTC',
    decimals: 8,
    logo: `https://raw.githubusercontent.com/ethboi/assets/main/btc.png`,
  },
  '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58': {
    address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    asset: 'USDT',
    decimals: 6,
    logo: `https://raw.githubusercontent.com/ethboi/assets/main/usdt.png`,
  },
}
