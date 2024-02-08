<script setup lang="ts">
onMounted(async () => {
  if (!isDark.value) toggleDark();
});

const dashboard = useDashboardStore()

async function init() {
  await dashboard.fetchTvlChartHistory()
  await dashboard.fetchTotalUsers()
}

init()
</script>

<template>
  <div class="text-blue-primary w-full gap-[40px] md:flex md:flex-wrap" dark="text-white">
    <div class="flex-1 w-full min-w-[300px] min-h-[50px]">
      <div class="my-[20px]">
        <DashboardChart />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: app
</route>

<style scoped></style>