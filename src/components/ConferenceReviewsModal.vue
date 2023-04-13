<script setup>
    import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useRouter, useRoute } from 'vue-router'
    import { useConferencesStore } from '@/stores/storeConferences'
    import { toDate } from '@/composables/toDate'

    const storeConferences = useConferencesStore()
    const router = useRouter()
    const route = useRoute()

    const props = defineProps({
        modelValue: {
            type: Boolean,
            dafault: false
        },
        reviews: {
            type: Object,
            required: true
        }
    })
    const emit = defineEmits(['update:modelValue'])
    const closeModal = () => {
        emit('update:modelValue', false)
    }
    const modalCardRef = ref(null)

    onClickOutside(modalCardRef, closeModal)

    const handleKeyboard = e => {
        if (e.key === 'Escape') closeModal()
    }
    onMounted(() => {
        document.addEventListener('keyup', handleKeyboard);
    })
    onUnmounted(() => {
        document.removeEventListener('keyup', handleKeyboard);
    })
</script>
<template>
  <div class="g-modal">
    <div class="g-modal__window" ref="modalCardRef">
      <span class="g-modal__title">Recenze</span>
      <div class="g-modal__content">
        <div class="content-item mb-4" v-for="review in props.reviews">
            <p><strong>Článek:</strong> {{ review.articleForReview }} </p>
            <p><strong>Autor:</strong> {{ review.author }}</p>
            <p><strong>Vytvořeno:</strong> {{ toDate(review.createDate) }}</p>
            <ul>
                <li v-for="item in review.blocks"><strong>{{ item.title }}:</strong> {{ item.value }}</li>
            </ul>
            <p><strong>Veřejný komentář:</strong> {{ review.publicComments }}</p>
            <p><strong>Soukromý komentář:</strong> {{ review.privateComments }}</p>
            <p><strong>Všeobecné doporučení:</strong> {{ review.overallRecomendation }}</p>
        </div>
      </div>
      <div class="g-modal__buttons">
          <button class="g-btn g-btn--blue" @click.prevent="closeModal">Zavřít</button>
      </div>
    </div>
  </div>
</template>