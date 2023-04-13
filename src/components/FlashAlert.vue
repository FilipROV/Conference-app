<script setup>
  import { useAuthStore } from '@/stores/storeAuth'
  const storeAuth = useAuthStore()
</script>
<template>
  <div :class="[`g-flash-alert g-flash-alert--${storeAuth.flashAlert.type}`]">
    {{ storeAuth.flashAlert.message }}
  </div>
</template>
