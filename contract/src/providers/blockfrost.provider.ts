import { BlockfrostProvider } from '@meshsdk/core'
import { env } from '../constants/env'

export const blockfrostProvider = new BlockfrostProvider(env.BLOCKFROST_API_KEY_PREPROD)
