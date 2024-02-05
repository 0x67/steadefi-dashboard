import { acceptHMRUpdate, defineStore } from "pinia";
import { fetchData } from "~/globals/utils";
import { TvlChartHistory } from "~/types";

export const useDashboardStore = defineStore('dashboard', () => {
  const tvlHistoryData = ref<TvlChartHistory[]>([])

  async function fetchTvlChartHistory() {
    const path = `dashboard/tvl`

    const data = await fetchData<TvlChartHistory[]>({
      path,
      method: 'GET',
      cacheResult: false,
    }).catch(() => {})
    

    if (Array.isArray(data))
      tvlHistoryData.value = data

      
    return data as TvlChartHistory[]
  }

  return {
    tvlHistoryData,
    fetchTvlChartHistory,
  }
})


if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
