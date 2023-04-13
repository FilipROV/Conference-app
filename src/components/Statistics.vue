<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/storeAuth'
import { useConferencesStore } from '@/stores/storeConferences'
import { useReviewsStore } from '@/stores/storeReviews'

const selectchange = ref('')
const storeAuth = useAuthStore(),
      storeConferences = useConferencesStore(),
      storeReviews = useReviewsStore()
storeReviews.getAllReviews()
</script>
<template>
  <section class="s-statistics">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <p><strong>Celkový počet konferencí:</strong> {{ storeConferences.totalConferencesCount }}</p>
          <p><strong>Celkový počet uživatelů:</strong> {{ storeAuth.totalUsersCount }}</p>
          <p><strong>Celkový počet recenzí:</strong> {{ storeReviews.totalReviewsCount }}</p>
        </div>
      </div>
    </div>
  </section>
</template>