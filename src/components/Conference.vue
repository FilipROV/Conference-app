<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConferencesStore } from '@/stores/storeConferences';
import { useAuthStore } from '@/stores/storeAuth'
import { useReviewsStore } from '@/stores/storeReviews'
import DeleteConferenceModal from '@/components/DeleteConferenceModal.vue'
import UpdateConferenceModal from '@/components/UpdateConferenceModal.vue'
import RegisterToConferenceModal from '@/components/RegisterToConferenceModal.vue'
import RegisteredParticipansModal from '@/components/RegisteredParticipansModal.vue'
import ConferenceReviewsModal from '@/components/ConferenceReviewsModal.vue'
import { toDate } from '@/composables/toDate'


const storeAuth = useAuthStore()
const storeConferences = useConferencesStore()
const storeReviews = useReviewsStore()
const route = useRoute()
const router = useRouter()
const conference = reactive({})
onMounted(() => {
  setTimeout(() => {
    conference.title = storeConferences.getConferenceContent(route.params.id).title
    conference.preTitle = storeConferences.getConferenceContent(route.params.id).preTitle
    conference.date = storeConferences.getConferenceContent(route.params.id).date
    conference.cooperations = storeConferences.getConferenceContent(route.params.id).cooperations
    conference.editorData = storeConferences.getConferenceContent(route.params.id).editorData
    conference.createDate = storeConferences.getConferenceContent(route.params.id).createDate
    storeReviews.getReviews(route.params.id)
  }, 1000);
})

const cooperationsArr = () => {
  return conference.cooperations.split(';')
}

const modals = reactive({
  deleteConference: false,
  updateConference: false,
  registerToConference: false,
  registeredParticipans: false,
  conferenceReviews: false
})

</script>
<template>
<div class="g-loader__wrapper" v-if="!Object.keys(conference).length">
  <div class="g-loader"></div>
</div>
<section class="s-conference" v-else>
  <div class="container">
    <RouterLink to="/conferences" class="mb-4 d-inline-block back-link">
      <div class="back-link__wrapper">
        <img src="../assets/img/icons/arrow-back.svg" alt="icon">
        <span>Zpět</span>
      </div>
    </RouterLink>
    <div class="s-conference__actions row justify-content-md-between align-items-center">
      <div class="col-12 col-md-auto mb-3">
        Vytvořeno: {{toDate(conference.createDate)}}
      </div>
      <div class="col-12 col-md-auto d-flex flex-column d-md-block mb-3">
        <button v-if="storeAuth.user.role === 'admin'" @click.prevent="modals.conferenceReviews = true" class="g-btn g-btn--blue">Recenze</button>
        <button v-if="storeAuth.user.role === 'admin'" @click.prevent="modals.registeredParticipans = true" class="g-btn g-btn--blue">Účastníci</button>
        <button @click.prevent="modals.registerToConference = true" class="g-btn g-btn--blue">Registrovat se</button>
        <button v-if="storeAuth.user.role === 'admin'" @click.prevent="modals.updateConference = true" class="g-btn g-btn--blue">Upravit</button>
        <button v-if="storeAuth.user.role === 'admin'" @click.prevent="modals.deleteConference = true" class="g-btn g-btn--red">Smazat</button>
      </div>
    </div>
    <div class="s-conference__wrapper">
      <div class="row s-conference__section">
        <div class="col-12">
          <div class="s-conference__department">
            <span class="name">Department of Systems Engineering, Faculty of Economics  VŠB - Technical University of Ostrava</span>
            <img src="../assets/img/ekf-logo.png" alt="image" class="image img-fluid">
            <span class="organisator">organises under the auspices of the faculty dean  doc. Vojtěch Spáčil, CSc.</span>
            <span class="pre-title">{{ conference.preTitle }}</span>
          </div>
        </div>
        <div class="col-12">
          <h1 class="s-conference__title">{{ conference.title }}</h1>
          <img src="../assets/img/smsis-logo.png" alt="image" class="s-conference__logo img-fluid">
          <span class="s-conference__date">{{ conference.date }}</span>
          <span class="s-conference__university">VŠB - Technical University of Ostrava,</span>
          <span class="s-conference__city">Ostrava, Czech Republic</span>
          <div class="s-conference__cooperations">
            <span class="headline">in cooperation with</span>
            <ul class="items">
              <li class="items__item" v-for="item in cooperationsArr()">{{item }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="s-conference__content ql-editor" v-html="conference.editorData"></div>
    </div>
  </div>
</section>
<transition>
  <DeleteConferenceModal v-if="modals.deleteConference" v-model="modals.deleteConference" :conferenceId="route.params.id" :conferenceName="conference.title" />
</transition>
<transition>
  <UpdateConferenceModal v-if="modals.updateConference" v-model="modals.updateConference" :conferenceId="route.params.id" :conferenceData="conference" />
</transition>
<transition>
  <RegisterToConferenceModal v-if="modals.registerToConference" v-model="modals.registerToConference" :conferenceId="route.params.id" :conferenceName="conference.title" />
</transition>
<transition>
  <RegisteredParticipansModal v-if="modals.registeredParticipans" v-model="modals.registeredParticipans" :conferenceId="route.params.id" />
</transition>
<transition>
  <ConferenceReviewsModal v-if="modals.conferenceReviews" v-model="modals.conferenceReviews" :reviews="storeReviews.reviews"/>
</transition>
</template>
