import { acceptHMRUpdate, defineStore } from "pinia";
import { fetchData } from "~/globals/utils";
import { TvlChartResponse, TvlChartHistory } from "~/types";

export const useDashboardStore = defineStore('dashboard', () => {
  const lendingTvlHistoryData = ref<TvlChartHistory[]>([])
  const vaultTvlHistoryData = ref<TvlChartHistory[]>([])
  const uniqueDatetime = ref<string[]>([])
  const uniqueLendings = ref<string[]>([])
  const uniqueVaults = ref<string[]>([])

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
      }),

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
    }

    return data
  }

  return {
    lendingTvlHistoryData,
    vaultTvlHistoryData,
    uniqueDatetime,
    uniqueLendings,
    uniqueVaults,
    fetchTvlChartHistory,
  }
})


if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
