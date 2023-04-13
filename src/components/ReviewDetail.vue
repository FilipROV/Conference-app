<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useReviewsStore } from '@/stores/storeReviews'
import { useConferencesStore } from '@/stores/storeConferences'
import { useAuthStore } from '@/stores/storeAuth'
import { useRoute } from 'vue-router'
import { toDate } from '@/composables/toDate'

const route = useRoute()
const storeAuth = useAuthStore()
const storeReviews = useReviewsStore()
const storeConferences = useConferencesStore()

onBeforeMount(() => {
  storeReviews.getAllReviews()
})
const review = reactive({});
setTimeout(() => {
  review.conference = storeConferences.getConferenceContent(storeReviews.getReviewContent(route.params.id).conference).title,
  review.author = storeReviews.getReviewContent(route.params.id).author,
  review.articleForReview = storeReviews.getReviewContent(route.params.id).articleForReview ,
  review.createDate = toDate(storeReviews.getReviewContent(route.params.id).createDate),
  review.blocks = storeReviews.getReviewContent(route.params.id).blocks,
  review.publicComments = storeReviews.getReviewContent(route.params.id).publicComments,
  review.privateComments = storeReviews.getReviewContent(route.params.id).privateComments,
  review.overallRecomendation = storeReviews.getReviewContent(route.params.id).overallRecomendation
}, 1000)

</script>
<template>
  <div class="g-loader__wrapper" v-if="!Object.keys(review).length">
    <div class="g-loader"></div>
  </div>
  <section class="s-reviews" v-else>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="s-reviews__title">Recenze ke konferenci {{ review.conference }}</h1>
        </div>
        <div class="col-12">
          <div class="s-reviews__card mb-3 mt-3">
            <div class="heading mb-3">
              <span>Vytvořil: {{ review.author }}</span>
              <span>Vytvořeno: {{ review.createDate }}</span>
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
            <div class="mb-2" v-if="storeAuth.user.role === 'admin'">
              <p><strong>Private comment:</strong></p>
              <p>{{ review.privateComments }}</p>
            </div>
            <div class="mb-2">
              <p><strong>Overall recomendation: </strong>{{ review.overallRecomendation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>