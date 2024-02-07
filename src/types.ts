import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type TvlChartHistory  = {
  id: string
  symbol: string
  timestamp: Date
  tvl: number
  _timestamp: number
}

export type TvlChartResponse = {
  lending: TvlChartHistory[]
  vault: TvlChartHistory[]
}