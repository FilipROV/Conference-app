<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/storeAuth'
import { useConferencesStore } from '@/stores/storeConferences'
import { useReviewsStore } from '@/stores/storeReviews'
import { toDate } from '@/composables/toDate'
import SendReviewModal from '@/components/SendReviewModal.vue'

const selectchange = ref('')
const modal = ref(false)
const reviewToSend = ref('')
const storeAuth = useAuthStore(),
      storeConferences = useConferencesStore(),
      storeReviews = useReviewsStore()

storeReviews.reviews = []

const onSelect = () => {
  storeReviews.getReviews(selectchange.value)
}
const reviewDetail = (review) => {
   reviewToSend.value = review
}
</script>
<template>
  <section class="s-reviews">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="s-reviews__title">Výpis Recenzí</h1>
        </div>
        <div class="col-12">
          <select class="s-reviews__select" name="conferences" id="conferences" @change="onSelect" v-model="selectchange">
            <option value="" disabled>Vyberte Konferenci</option>
            <option v-for="conference in storeConferences.conferences" :value="conference.id">{{conference.title}}</option>
          </select>
        </div>
        <div class="col-12" v-for="review in storeReviews.reviews">
          <div class="s-reviews__card mb-3 mt-3">
            <div class="heading mb-3">
              <span>Vytvořil: {{ review.author }}</span>
              <span>Vytvořeno: {{ toDate(review.createDate) }}</span>
            </div>
            <div class="mb-2">
              <p><strong>Článek:</strong> {{ review.articleForReview }}</p> 
            </div>
            <ul class="mb-2">
              <li v-for="item in review.blocks"><strong>{{ item.title }}:</strong> {{ item.value }}</li>
            </ul>
            <div class="mb-2">
              <p><strong>Public comment:</strong></p>
              <p>{{ review.publicComments }}</p>
            </div>
            <div class="mb-2">
              <p><strong>Private comment:</strong></p>
              <p>{{ review.privateComments }}</p>
            </div>
            <div class="mb-2">
              <p><strong>Overall recomendation: </strong>{{ review.overallRecomendation }}</p>
            </div>
            <div class="mb-2 d-flex justify-content-end">
              <button @click.prevent="modal = true, reviewDetail(review)" class="g-btn g-btn--blue">Přeposlat recenzi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <transition>
    <SendReviewModal v-if="modal" v-model="modal" :review="reviewToSend" />
  </transition>
</template>
