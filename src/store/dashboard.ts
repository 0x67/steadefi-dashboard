import { acceptHMRUpdate, defineStore } from "pinia";
import { subDays } from 'date-fns';
import { fetchData, formatNumber } from "~/globals/utils";
import { TvlChartResponse, TvlChartHistory } from "~/types";

export const useDashboardStore = defineStore('dashboard', () => {
  const isFetching = ref(false)
  const lendingTvlHistoryData = ref<TvlChartHistory[]>([])
  const vaultTvlHistoryData = ref<TvlChartHistory[]>([])
  const uniqueDatetime = ref<string[]>([])
  const uniqueLendings = ref<string[]>([])
  const uniqueVaults = ref<string[]>([])
  const tvl = ref<string>('$0.00')
  const uniqueUsers = ref<Set<string>>(new Set())
  const date = ref(new Date())
  const dateRange = ref([subDays(date.value, 14), date.value])
  const disabledDateChange = computed(() => {
    return dateRange.value[1] >= date.value
  })

  async function fetchTvlChartHistory() {
    isFetching.value = true
    const path = `dashboard/tvl?startDate=${dateRange.value[0].toISOString()}&endDate=${dateRange.value[1].toISOString()}`

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

    isFetching.value = false
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

  watch(dateRange, async () => {
    await fetchTvlChartHistory()
  })

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
    date,
    dateRange,
    disabledDateChange,
    isFetching
  }
})


if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
