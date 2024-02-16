<template>
  <div class="flex flex-col font-manrope min-h-[100vh]">
    <!-- desktop navigation -->
    <HeaderDesktop />
    <main class="m-auto flex-1 w-full max-w-[1280px] p-[20px]">
      <RouterView />
    </main>
    <!-- <Footer /> -->
    
    <!-- <div class="opacity-70 right-5 bottom-3.5 z-1000 fixed">
      <div
        v-if="appStore.isSyncing"
        class="flex text-amber-600 gap-1 items-center"
        dark="text-yellow-secondary"
      >
        <i i="line-md-loading-twotone-loop" class="text-xs animate-spin"></i>
        <span class="font-medium text-13px">syncing</span>
      </div>
      <div v-else class="flex text-green-secondary gap-1 items-center">
        <i i="mdi-cloud-check-variant-outline" class="text-xs"></i>
        <span class="font-medium text-13px">synced</span>
        <i
          i="mdi-refresh"
          class="cursor-pointer text-xs"
          hover="bg-gray-200"
          @click="fetchAllData"
        ></i>
      </div>
    </div> -->
  </div>
</template>

<style>
.Vue-Toastification__progress-bar {
  background-color: #073146;
}

html.dark .Vue-Toastification__progress-bar {
  background-color: #fff;
}

.bg-alert {
  background: rgb(253, 29, 29);
  background: linear-gradient(163deg, rgba(253, 29, 29, 1) 0%, rgba(252, 136, 69, 1) 100%);
}

.bg-beta {
  background: linear-gradient(163deg, #1d44fd 0%, #4582fc 100%);
}

.bg-long {
  background: linear-gradient(163deg, #178f1f 0%, #2e6009 100%);
}

.bg-neutral {
  background: linear-gradient(163deg, #b5b5b5 0%, #7f7f7f 100%);
}

.bg-short {
  background: linear-gradient(163deg, #c90000 0%, #820000 100%);
}

.bg-lending {
  background: linear-gradient(163deg, #0fc3d6 0%, #117cac 100%);
}

@media screen and (max-width: 600px) {
  .toast-mobile {
    width: 80% !important;
    margin-left: auto !important;
    margin-right: 20px !important;
    margin-bottom: 20px;
  }
}

@media screen and (max-width: 370px) {
  .toast-mobile {
    margin-right: auto !important;
  }
}
</style>
