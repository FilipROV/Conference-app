<script setup>
  import Header from '@/layout/Header.vue';
   import FlashAlert from '@/components/FlashAlert.vue';
  import { onMounted } from 'vue'
  import { useAuthStore } from '@/stores/storeAuth'
  import { useConferencesStore } from '@/stores/storeConferences'


  const storeAuth = useAuthStore()
  const storeConferences = useConferencesStore()
  onMounted(() => {
    storeAuth.init()
    storeConferences.init()
  })
    
</script>
<template>
  <Transition>
    <FlashAlert v-if="storeAuth.flashAlert.message" />
  </Transition>
  <Header />
  <main>
    <RouterView />
  </main>
</template>
<style>
  @import './assets/css/style.css';
</style>