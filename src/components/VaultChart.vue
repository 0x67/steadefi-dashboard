<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkAreaComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import { graphic } from 'echarts';
import { storeToRefs } from 'pinia';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkAreaComponent,
]);

const dashboard = useDashboardStore();
const { lendingTvlHistoryData, vaultTvlHistoryData } = storeToRefs(dashboard);

const stackedTvlOptions = ref({
  title: {
    text: 'Stacked TVL'
  },
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontFamily: 'Manrope',
    },
    padding: 0,
    borderWidth: 0,
    borderColor: '#333',
    borderRadius: 5,
    className: 'w-80',
    confine: true,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  yAxis: [
    {
      type: 'value'
    }
  ],
})

const lendingStackedTvlOptions = ref({})
const vaultStackedTvlOptions = ref({})

function updateLendingStackedTvlOptions() {
  const uniqueTimestamps = new Set(lendingTvlHistoryData.value.map((item) => item.timestamp.toLocaleDateString()))
  const uniqueLendings = new Set(lendingTvlHistoryData.value.map((item) => item.symbol))
  
  lendingStackedTvlOptions.value = {
    ...stackedTvlOptions.value,
    title: {
      text: 'Lending TVL Breakdown',
      textStyle: {
        color: '#ffffff',
      },
    },
    tooltip: {
      ...stackedTvlOptions.value.tooltip,
      formatter: formatterTooltipLiquidity,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: Array.from(uniqueTimestamps)
      }
    ],
    series: (Array.from(uniqueLendings).map((symbol) => ({
      name: symbol,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: lendingTvlHistoryData.value.filter((item) => item.symbol === symbol).map((item) => {
        if (uniqueTimestamps.has(item.timestamp.toLocaleDateString())) {
          return item.tvl
        }
        
        return 0
      }), 
    }))),
  }
}

function updateVaultStackedTvlOptions() {
  const uniqueTimestamps = new Set(vaultTvlHistoryData.value.map((item) => item.timestamp.toLocaleDateString()))

  vaultStackedTvlOptions.value = {
    ...stackedTvlOptions.value,
    title: {
      text: 'Vault TVL Breakdown',
      textStyle: {
        color: '#ffffff',
      },
    },
    tooltip: {
      ...stackedTvlOptions.value.tooltip,
      formatter: formatterTooltipLiquidity,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: Array.from(uniqueTimestamps)
      }
    ],
    series: (Array.from(new Set(vaultTvlHistoryData.value.map((item) => item.symbol))).map((symbol) => ({
      name: symbol,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: vaultTvlHistoryData.value.filter((item) => item.symbol === symbol).map((item) => {
        if (uniqueTimestamps.has(item.timestamp.toLocaleDateString())) {
          return item.tvl
        }
        
        return 0
      }), 
    }))),
  }
}

function formatterTooltipLiquidity(params: any) {
  const tooltips = params.sort((a: any, b: any) => b.value - a.value).map((param: any) => {
    return `
      <div class="flex gap-2 items-center">
        <div class="rounded-sm h-12px w-12px " style="background: ${param.color}"></div>
        <span>${param.seriesName}</span>
        <span class="ml-auto">$${parseFloat(param.value || 0).toFixed(2)}</span>
      </div>
    `
  })
  
  const total = params.reduce((acc: number, param: any) => acc + parseFloat(param.value || 0), 0)

  tooltips.push(`
    <div class="flex gap-2 items-center">
      <span class="font-bold">Total</span>
      <span class="font-bold ml-auto">$${total.toFixed(2)}</span>
    </div>
  `)

  return `
    <div class="bg-white font-bold rounded-5px px-5 pt-4 pb-4 text-#073146 text-13px dark:bg-#000000 dark:text-white">
      <div class="flex h-6 items-center">
        <span class="text-#AAAAAA">${params[0].axisValue}</span>
      </div>
      
      ${tooltips.join('')}
    </div>
  `;
}
function updateOptions() {
  updateLendingStackedTvlOptions()
  updateVaultStackedTvlOptions()
}

watch(dashboard, (updateOptions))
updateOptions()
</script>

<template>
  <div>
    <div class="px-4 md:px-0">
      <v-chart class="h-24rem md:h-[450px]" :option="lendingStackedTvlOptions" autoresize />
    </div>
    <div class="px-4 md:px-0">
      <v-chart class="h-24rem md:h-[450px]" :option="vaultStackedTvlOptions" autoresize />
    </div>
  </div>
</template>


<style scoped></style>