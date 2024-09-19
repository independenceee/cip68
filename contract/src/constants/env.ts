import 'dotenv/config'

export const env = {
    BLOCKFROST_RPC_URL_PREPROD: process.env.BLOCKFROST_RPC_URLPREPROD as string,
    BLOCKFROST_API_KEY_PREPROD: process.env.BLOCKFROST_API_KEY_PREPROD as string
} as const
