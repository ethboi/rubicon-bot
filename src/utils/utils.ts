export function Timestamp(): number {
  return Math.floor(Date.now() / 1000)
}

export const toDate = (value: number): Date => {
  return new Date(value * 1000)
}

export function convertToBoolean(input: string): boolean | undefined {
  try {
    return JSON.parse(input.toLowerCase())
  } catch (e) {
    return undefined
  }
}

export function shortAddress(value: string): string {
  return `${value.slice(0, 5)}...${value.slice(-4)}`
}

export function firstAddress(value: string): string {
  return `${value.slice(0, 5)}`
}

export function dollar(value: number): string {
  const nonNeg = value > 0 ? value : value * -1
  return `${value > 0 ? '+' : '-'}$${nonNeg.toFixed(2)}`
}

export function signed(value: number): string {
  const nonNeg = value > 0 ? value : value * -1
  return `${value > 0 ? '+' : '-'}${nonNeg.toFixed(2)}`
}

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    ;(groups[key(item)] ||= []).push(item)
    return groups
  }, {} as Record<K, T[]>)
