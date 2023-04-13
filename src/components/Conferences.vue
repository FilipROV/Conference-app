<script setup>
import { ref } from 'vue';
import { useConferencesStore } from '@/stores/storeConferences';
import { toDate } from '@/composables/toDate'

const storeConferences = useConferencesStore()
</script>

<template>
  <section class="s-conferences">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="s-conferences__title">Výpis Konferencí</h1>
        </div>
      </div>
      <div class="row gy-4">
        <div class="col-lg-3 col-md-6 s-conferences__item" v-for="conference in storeConferences.conferences">
          <RouterLink :to="`/conferences/${conference.id}`">
            <span class="title">{{ conference.title }}</span>
            <span class="create-date">Vytvořeno: {{toDate(conference.createDate)}}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>  
</template>