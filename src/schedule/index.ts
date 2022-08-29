import { Job, scheduleJob } from 'node-schedule'
import { GetPrices } from '../integrations/coingecko'

export function PricingJob(): void {
  scheduleJob('*/20 * * * *', async () => {
    GetPrices()
  })
}

// Monday / Wednesday / Friday (as this resets each build)
export const TriWeeklyJobs: Job = scheduleJob('0 0 * * 1,3,5', async () => {
  // do stuff
})
