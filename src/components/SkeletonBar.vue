<script setup lang="ts">
import { NSkeleton } from 'naive-ui';

const props = defineProps<{
  // width: number | string;
  class?: string;
  repeat?: number;
}>();
</script>

<template>
  <n-skeleton :class="`${props.class}`" :text="true" :theme-overrides="{
    color: isDark ? '#263254' : '#eee',
    colorEnd: isDark ? '#151f3d' : '#ccc',
  }" :repeat="props.repeat || 0" />
</template>
