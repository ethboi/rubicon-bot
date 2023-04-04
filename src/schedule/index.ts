import { scheduleJob } from 'node-schedule'
import { GetPrices } from '../integrations/prices'

export function PricingJob() {
  scheduleJob('*/20 * * * *', async () => {
    await GetPrices()
  })
}
