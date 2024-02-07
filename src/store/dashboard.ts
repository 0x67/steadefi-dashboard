import { acceptHMRUpdate, defineStore } from "pinia";
import { fetchData } from "~/globals/utils";
import { TvlChartResponse, TvlChartHistory } from "~/types";

export const useDashboardStore = defineStore('dashboard', () => {
  const lendingTvlHistoryData = ref<TvlChartHistory[]>([])
  const vaultTvlHistoryData = ref<TvlChartHistory[]>([])

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
          _timestamp: new Date(item.timestamp).getTime(),
        }
      }),
      vaultTvlHistoryData.value = data.vault.map((item) => {
        return {
          ...item,
          timestamp: new Date(item.timestamp),
          _timestamp: new Date(item.timestamp).getTime(),
        }
      })
    }

    return data
  }

  return {
    lendingTvlHistoryData,
    vaultTvlHistoryData,
    fetchTvlChartHistory,
  }
})


if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
