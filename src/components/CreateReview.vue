<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConferencesStore } from '@/stores/storeConferences'
import { useReviewsStore } from '@/stores/storeReviews'
import { useAuthStore } from '@/stores/storeAuth'
import emailjs from '@emailjs/browser';
import { v4 as uuidv4 } from 'uuid';

const route = useRoute()
const router = useRouter()
const storeAuth = useAuthStore()
const storeConferences = useConferencesStore()
const storeReviews = useReviewsStore()
const conferenceReviewData = reactive({
  conference: '',
  articleForReview: '',
  author: storeAuth.user.username,
  blocks: [
    {
      title: 'Clarity in writing, tables and figures',
      value: ''
    },
    {
      title: 'Correctness of English',
      value: ''
    },
    {
      title: 'Organization of the manuscript',
      value: ''
    },
    {
      title: 'Originality of the paper',
      value: ''
    },
    {
      title: 'Quotations and references to other works',
      value: ''
    },
    {
      title: 'Relevance of the paper with SMSIS',
      value: ''
    },
    {
      title: 'Research methodology and treatment',
      value: ''
    },
    {
      title: 'Significance of presented results',
      value: ''
    }
  ],
  publicComnents: '',
  privateComments: '',
  overallRecomendation: ''
})
const uniqueID = ref('')
const createReview = () => {
  if (conferenceReviewData.conference) {
    uniqueID.value = uuidv4()
    storeReviews.addReview(conferenceReviewData, uniqueID.value)
    sendEmail()
    router.push('/')
  } else {
    storeAuth.showFlashAlert('Prosím zvolte konferenci, kterou chcete recenzovat','fail')
  }
}
const sendEmail = () => {
  const templateParams = {
    creator: `${conferenceReviewData.author} (${storeAuth.user.email})`,
    review: `${window.location.origin}/#/reviews/${uniqueID.value}`,
    send_to: storeAuth.user.email,
    conference: `${window.location.origin}/#/conferences/${conferenceReviewData.conference}`
  }
  emailjs.send('service_5hxdw4p', 'template_18as0om',templateParams,'r9-84n9VAghnejqeI')
  .then((result) => {
      console.log('SUCCESS!', result.text);
  }, (error) => {
      console.log('FAILED...', error.text);
  });
}
</script>
<template>
  <section class="s-createReview">
    <div class="container">
      <div class="s-createReview__wrapper">
        <h1 class="s-createReview__title">Vytvořit Recenzi</h1>
        <form @submit.prevent="createReview" class="s-createReview__form">
          <div class="mt-4 mb-3">
            <label for="conferences">Recenze ke konferenci:</label>
            <select name="conferences" id="conferences" v-model="conferenceReviewData.conference">
              <option value="" disabled>Vyberte Konferenci</option>
              <option v-for="conference in storeConferences.conferences" :value="conference.id">{{conference.title}}</option>
            </select>
          </div>
          <div class="mb-4 s-createReview__input">
            <input type="text" id="article" name="article" placeholder="Zadejte název článku k recenzi" v-model="conferenceReviewData.articleForReview" required>
          </div>
          <div class="s-createReview__block mb-3" v-for="(item, index) in conferenceReviewData.blocks">
            <h2>{{ item.title }}</h2>
            <div class="s-createReview__radios">
              <div class="item">
                <input type="radio" :name="index" :id="'block'+index+'-poor'" value="poor" v-model="item.value" required>
                <label :for="'block'+index+'-poor'">poor</label>
              </div>
              <div class="item">
                <input type="radio" :name="index" :id="'block'+index+'-marginal'" value="marginal" v-model="item.value">
                <label :for="'block'+index+'-marginal'">marginal</label>
              </div>
              <div class="item">
                <input type="radio" :name="index" :id="'block'+index+'-acceptable'" value="acceptable" v-model="item.value">
                <label :for="'block'+index+'-acceptable'">accteptable</label>
              </div>
              <div class="item">
                <input type="radio" :name="index" :id="'block'+index+'-good'" value="good" v-model="item.value">
                <label :for="'block'+index+'-good'">good</label>
              </div>
            </div>
          </div>
          <div class="s-createReview__block mb-3">
            <h2>Public comments to the author:</h2>
            <textarea name="publicComments" id="publicComments" cols="30" rows="8" v-model="conferenceReviewData.publicComments" required></textarea>
          </div>
          <div class="s-createReview__block mb-3">
            <h2>Private comments to the editorial committee:</h2>
            <textarea name="privateComments" id="privateComments" cols="30" rows="8" v-model="conferenceReviewData.privateComments" required></textarea>
          </div>
          <div class="s-createReview__block mb-3">
            <h2>Overall recommendation:</h2>
            <div class="s-createReview__radios">
              <div class="item">
                <input type="radio" id="1" name="recom" value="accept" v-model="conferenceReviewData.overallRecomendation" required>
                <label for="1">accept</label>
              </div>
              <div class="item">
                <input type="radio" id="2" name="recom" value="revision without another review" v-model="conferenceReviewData.overallRecomendation">
                <label for="2">revision without another review</label>
              </div>
              <div class="item">
                <input type="radio" id="3" name="recom" value="revision, another review is required" v-model="conferenceReviewData.overallRecomendation">
                <label for="3">revision, another review is required</label>
              </div>
              <div class="item">
                <input type="radio" id="4" name="recom" value="reject" v-model="conferenceReviewData.overallRecomendation">
                <label for="4">reject</label>
              </div>
            </div>
          </div>
          <div class="row justify-content-end">
            <div class="col-auto">
              <button class="g-btn g-btn--blue">Vytvořit</button>
            </div>
          </div>
        </form>
      </div>
    </div>  
  </section>
</template>