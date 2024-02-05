import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type TvlChartHistory = {
  lendingPoolId: string
  symbol: string
  bucket: Date
  tvl: number
}