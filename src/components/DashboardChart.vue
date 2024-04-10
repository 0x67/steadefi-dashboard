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
import { storeToRefs } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import { subDays } from 'date-fns';
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
const {
  lendingTvlHistoryData,
  vaultTvlHistoryData,
  uniqueDatetime,
  uniqueLendings,
  uniqueVaults,
  tvl,
  uniqueUsers,
  date,
  dateRange,
  disabledDateChange,
  isFetching
} = storeToRefs(dashboard);

const defaultOptions = ref({
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
    right: '3%',
    bottom: '5%',
    containLabel: true
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (val: any) => `$${val / 1000}K`
    }
  },
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
        <div class="rounded-sm h-12px w-12px" style="background: ${param.color}"></div>
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

function onLeftButtonClick() {
  dateRange.value = [subDays(dateRange.value[0], 14), subDays(dateRange.value[1], 14)]
}

function onRightButtonClick() {
  const newRange = [subDays(dateRange.value[0], -14), subDays(dateRange.value[1], -14)]

  // Prevent the future date
  if (newRange[1] > date.value) {
    dateRange.value = [subDays(date.value, 14), date.value]
  } else {
    dateRange.value = newRange
  }
}


watch(dashboard, (updateOptions))
updateOptions()
</script>

<template>
  <div>
    <div class="rounded-md flex bg-[#00000059] h-15 text-lg mb-10 w-full opacity-90 gap-4 items-center justify-between">
      <div class="flex p-5 gap-5 justify-between">
        <div class="">
          <span>TVL: </span>
          <span class="font-bold text-#ffffff">{{ tvl }}</span>
        </div>

        <div>
          <span>Total Users: </span>
          <span class="font-bold text-#ffffff">{{ uniqueUsers.size }}</span>
        </div>
      </div>

      <div class="flex p-5 gap-5 justify-between">
        <button @click="onLeftButtonClick">
          <svg fill="#000000" class="h-6 fill-white text-white w-6" version="1.1" id="Layer_1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"
            xml:space="preserve">
            <g>
              <g>
                <g>
                  <path d="M256,5.333C114.88,5.333,0,117.76,0,256s114.88,250.667,256,250.667S512,394.24,512,256S397.12,5.333,256,5.333z
				 M256,485.333C126.613,485.333,21.333,382.4,21.333,256S126.613,26.667,256,26.667S490.667,129.493,490.667,256
				S385.387,485.333,256,485.333z" />
                  <path d="M337.387,381.013c-0.107-0.107-0.32-0.213-0.427-0.32L167.36,256l169.6-124.8c4.8-3.413,5.76-10.133,2.347-14.827
				c-3.52-4.8-10.133-5.76-14.933-2.24L143.04,247.467c-4.693,3.52-5.76,10.133-2.24,14.933c0.64,0.853,1.387,1.6,2.24,2.24
				l181.333,133.227c4.693,3.627,11.307,2.773,14.933-1.92C342.933,391.253,342.08,384.64,337.387,381.013z" />
                </g>
              </g>
            </g>
          </svg>
        </button>
        <VueDatePicker dark range :clearable="false" :disabled="true" :enable-time-picker="false" v-model="dateRange" />
        <button @click="onRightButtonClick">
          <svg fill="#000000" class="h-6 fill-white text-white w-6" version="1.1" id="Layer_1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"
            xml:space="preserve">
            <g>
              <g>
                <g>
                  <path d="M256,5.333C114.88,5.333,0,117.76,0,256s114.88,250.667,256,250.667S512,394.24,512,256S397.12,5.333,256,5.333z
				 M256,485.333C126.613,485.333,21.333,382.4,21.333,256S126.613,26.667,256,26.667S490.667,129.493,490.667,256
				S385.387,485.333,256,485.333z" />
                  <path d="M369.28,247.467l-181.653-133.44c-4.693-3.627-11.307-2.773-14.933,1.92c-3.627,4.693-2.773,11.307,1.92,14.933
				c0.107,0.107,0.32,0.213,0.427,0.32L344.96,256L175.04,380.693c-4.8,3.52-5.76,10.133-2.24,14.933
				c3.52,4.8,10.133,5.76,14.933,2.24L369.387,264.64c4.8-3.52,5.76-10.133,2.24-14.933
				C370.88,248.853,370.133,248.107,369.28,247.467z" />
                </g>
              </g>
            </g>
          </svg>
        </button>
      </div>
    </div>

    <div class=" space-y-6">
      <div class="border border-light-300 px-4 md:px-0">
        <v-chart class="md:h-[450px]" :option="lendingStackedTvlOptions" autoresize v-if="!isFetching" />
        <SkeletonBar :class="'h-24rem md:h-[450px]'" v-else />
      </div>

      <div class="border border-light-300 px-4 md:px-0">
        <v-chart class="h-24rem md:h-[450px]" :option="lendingInflowOptions" autoresize v-if="!isFetching" />
        <SkeletonBar :class="'h-24rem md:h-[450px]'" v-else />
      </div>

      <div class="border border-light-300 px-4 md:px-0">
        <v-chart class="h-24rem md:h-[450px]" :option="vaultStackedTvlOptions" autoresize v-if="!isFetching" />
        <SkeletonBar :class="'h-24rem md:h-[450px]'" v-else />
      </div>

      <div class="border border-light-300 px-4 hover md:px-0">
        <v-chart class="h-24rem md:h-[450px]" :option="vaultInflowOptions" autoresize v-if="!isFetching" />
        <SkeletonBar :class="'h-24rem md:h-[450px]'" v-else />
      </div>
    </div>

  </div>
</template>


<style scoped>
.dp__main {
  width: auto;

  &:hover {
    cursor: pointer;
  }
}
</style>