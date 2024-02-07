<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart } from 'echarts/charts';
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
  BarChart,
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
const { lendingTvlHistoryData, vaultTvlHistoryData, uniqueDatetime, uniqueLendings, uniqueVaults } = storeToRefs(dashboard);

const defaultOptions = ref({
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
const lendingInflowOptions = ref({})
const vaultInflowOptions = ref({})

function updateLendingStackedTvlOptions() {
  lendingStackedTvlOptions.value = {
    ...defaultOptions.value,
    title: {
      text: 'Lending Vault TVL',
      textStyle: {
        color: '#ffffff',
      },
    },
    tooltip: {
      ...defaultOptions.value.tooltip,
      formatter: formatterTooltipLiquidity,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: uniqueDatetime
      }
    ],
    series: (uniqueLendings.value.map((symbol) => ({
      name: symbol,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: uniqueDatetime.value.map((timestamp) => {
        const item = lendingTvlHistoryData.value.find((item) => item.symbol === symbol && item.timestamp.toLocaleDateString() === timestamp)
        return item ? item.tvl : 0
      }),
    }))),
  }
}

function updateVaultStackedTvlOptions() {
  vaultStackedTvlOptions.value = {
    ...defaultOptions.value,
    title: {
      text: 'Strategy Vault TVL',
      textStyle: {
        color: '#ffffff',
      },
    },
    tooltip: {
      ...defaultOptions.value.tooltip,
      formatter: formatterTooltipLiquidity,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: uniqueDatetime
      }
    ],
    series: (uniqueVaults.value.map((symbol) => ({
      name: symbol,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: uniqueDatetime.value.map((timestamp) => {
        const item = vaultTvlHistoryData.value.find((item) => item.symbol === symbol && item.timestamp.toLocaleDateString() === timestamp)
        return item ? item.tvl : 0
      }),
    }))),
  }
}

function updateLendingInflowOptions() {
  lendingInflowOptions.value = {
    ...defaultOptions.value,
    title: {
      text: 'Lending Vault Inflow',
      textStyle: {
        color: '#ffffff',
      },
    },
    grid: {
      ...defaultOptions.value.grid,
      bottom: 100,
    },
    tooltip: {
      ...defaultOptions.value.tooltip,
      formatter: formatterTooltipInflow,
    },
    yAxis: {},
    xAxis: {
      data: uniqueDatetime,
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false }
    },
    series: [
      ...uniqueLendings.value.map((symbol) => ({
        name: symbol,
        type: 'bar',
        stack: 'one',
        data: uniqueDatetime.value.map((timestamp) => {
          const item = lendingTvlHistoryData.value.find((item) => item.symbol === symbol && item.timestamp.toLocaleDateString() === timestamp)
          return item ? item.inflow : 0
        }),
      })),
    ]
  }
}

function updateVaultInflowOptions() {
  vaultInflowOptions.value = {
    ...defaultOptions.value,
    title: {
      text: 'Strategy Vault Inflow',
      textStyle: {
        color: '#ffffff',
      },
    },
    grid: {
      ...defaultOptions.value.grid,
      bottom: 100,
    },
    tooltip: {
      ...defaultOptions.value.tooltip,
      formatter: formatterTooltipInflow,
    },
    yAxis: {},
    xAxis: {
      data: uniqueDatetime,
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false }
    },
    series: [
      ...uniqueVaults.value.map((symbol) => ({
        name: symbol,
        type: 'bar',
        stack: 'two',
        data: uniqueDatetime.value.map((timestamp) => {
          const item = vaultTvlHistoryData.value.find((item) => item.symbol === symbol && item.timestamp.toLocaleDateString() === timestamp)
          return item ? item.inflow : 0
        }),
      })),
    ]
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

function formatterTooltipInflow(params: any) {
  const tooltips = params.sort((a: any, b: any) => b.value - a.value).map((param: any) => {
    return `
        <div class="flex gap-2 items-center">
          <div class="rounded-sm h-12px w-12px " style="background: ${param.color}"></div>
          <span>${param.seriesName}</span>
          <span class="ml-auto">$${parseFloat(param.value || 0).toFixed(2)}</span>
        </div>
    `
  })

  return `
    <div class="bg-white font-bold rounded-5px px-5 pt-4 pb-4 text-#073146 text-13px dark:bg-#000000 dark:text-white">
      <div class="flex h-6 items-center">
        <span class="text-#AAAAAA">${params[0].axisValue}</span>
      </div>
      
      ${tooltips.join('')}
    </div>
  `
}

function updateOptions() {
  updateLendingStackedTvlOptions()
  updateVaultStackedTvlOptions()
  updateLendingInflowOptions()
  updateVaultInflowOptions()
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
      <v-chart class="h-24rem md:h-[450px]" :option="lendingInflowOptions" autoresize />
    </div>

    <div class="px-4 md:px-0">
      <v-chart class="h-24rem md:h-[450px]" :option="vaultStackedTvlOptions" autoresize />
    </div>

    <div class="px-4 md:px-0">
      <v-chart class="h-24rem md:h-[450px]" :option="vaultInflowOptions" autoresize />
    </div>

  </div>
</template>


<style scoped></style>