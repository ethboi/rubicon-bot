# Rubicon Bot

Run locally:

```
yarn install
yarn start
```

### Environment Variables

- `TESTNET` - true/false (if true prints to console, doesn't post)
- `INFURA_ID` - used to get ENS
- `INFURA_ID_OPTIMISM` - for everything else

### Integrations

#### Discord

- `DISCORD_ENABLED` - enable/disable posting to discord
- `DISCORD_ACCESS_TOKEN`

#### Twitter

- `TWITTER_ENABLED`
- `TWITTER_APP_KEY`
- `TWITTER_APP_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`

#### Telegram

- `TELEGRAM_ENABLED`
- `TELEGRAM_ACCESS_TOKEN`
- `TELEGRAM_CHANNEL`

### Thresholds

- `TWITTER_THRESHOLD`
- `TELEGRAM_THRESHOLD`
- `DISCORD_THRESHOLD`
