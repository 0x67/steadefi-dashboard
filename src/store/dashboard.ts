import { acceptHMRUpdate, defineStore } from "pinia";
import { fetchData, formatNumber } from "~/globals/utils";
import { TvlChartResponse, TvlChartHistory } from "~/types";

export const useDashboardStore = defineStore('dashboard', () => {
  const lendingTvlHistoryData = ref<TvlChartHistory[]>([])
  const vaultTvlHistoryData = ref<TvlChartHistory[]>([])
  const uniqueDatetime = ref<string[]>([])
  const uniqueLendings = ref<string[]>([])
  const uniqueVaults = ref<string[]>([])
  const tvl = ref<string>('$0.00')
  const uniqueUsers = ref<Set<string>>(new Set())

  async function fetchTvlChartHistory() {
    const path = `dashboard/tvl`

    const data = await fetchData<TvlChartResponse>({
      path,
      method: 'GET',
      cacheResult: false,
    }).catch(() => { })

    if (data) {
      lendingTvlHistoryData.value = data.lending.map((item) => {
        return {
          ...item,
          timestamp: new Date(item.timestamp),
        }
      })

      vaultTvlHistoryData.value = data.vault.map((item) => {
        return {
          ...item,
          timestamp: new Date(item.timestamp),
        }
      })


      uniqueDatetime.value = Array.from(new Set([
        ...lendingTvlHistoryData.value.map((item) => item.timestamp.toLocaleDateString()),
        ...vaultTvlHistoryData.value.map((item) => item.timestamp.toLocaleDateString())]))
      uniqueLendings.value = Array.from(new Set(lendingTvlHistoryData.value.map((item) => item.symbol)))
      uniqueVaults.value = Array.from(new Set(vaultTvlHistoryData.value.map((item) => item.symbol)))

      const lendingTvl = lendingTvlHistoryData.value
        .filter((item) => item.timestamp.toLocaleDateString() === uniqueDatetime.value[uniqueDatetime.value.length - 1])
        .reduce((acc, item) => +acc + +item.tvl, 0)
      const vaultTvl = vaultTvlHistoryData.value
        .filter((item) => item.timestamp.toLocaleDateString() === uniqueDatetime.value[uniqueDatetime.value.length - 1])
        .reduce((acc, item) => +acc + +item.tvl, 0)

      tvl.value = `$${formatNumber(lendingTvl + vaultTvl)}`
    }

    return data
  }

  async function fetchTotalUsers() {
    const avaxSubgraph = 'https://api.thegraph.com/subgraphs/name/0x67/steadefi-stats-avax'
    const arbSubgraph = 'https://api.thegraph.com/subgraphs/name/0x67/steadefi-stats-arb'

    const query = `
      query {
        users {
          id
        }
      }
    `

    const avaxResponse = await fetch(avaxSubgraph, {
      method: 'POST',
      body: JSON.stringify({ query }),
    })

    const { data: { users: avaxUsers } } = await avaxResponse.json() as {
      data: {
        users: { id: string }[]
      }
    }

    const arbResponse = await fetch(arbSubgraph, {
      method: 'POST',
      body: JSON.stringify({ query }),
    })

    const { data: { users: arbUsers } } = await arbResponse.json() as {
      data: {
        users: { id: string }[]
      }
    }

    uniqueUsers.value = new Set([
      ...avaxUsers.map((user) => user.id),
      ...arbUsers.map((user) => user.id),
    ])
  }

  return {
    lendingTvlHistoryData,
    vaultTvlHistoryData,
    uniqueDatetime,
    uniqueLendings,
    uniqueVaults,
    fetchTvlChartHistory,
    tvl,
    uniqueUsers,
    fetchTotalUsers,
  }
})


if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
