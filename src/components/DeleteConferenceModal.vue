<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import { useConferencesStore } from '@/stores/storeConferences'
    import { useReviewsStore } from '@/stores/storeReviews'

    const props = defineProps({
        modelValue: {
            type: Boolean,
            dafault: false
        },
        conferenceId: {
            type: String,
            required: true
        },
        conferenceName: {
            type: String,
            required: true
        }
    })
    const emit = defineEmits(['update:modelValue'])
    const closeModal = () => {
        emit('update:modelValue', false)
    }
    const storeConferences = useConferencesStore()
    const storeReviews = useReviewsStore()
    const router = useRouter()
    const modalCardRef = ref(null)

    onClickOutside(modalCardRef, closeModal)

    const handleKeyboard = e => {
        if (e.key === 'Escape') closeModal()
    }
    const deleteConference = () => {
      storeConferences.deleteConference(props.conferenceId)
      storeReviews.deleteReviews(props.conferenceId)
      router.push('/conferences')
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
      <span class="g-modal__title">Odstranit Konferenci</span>
      <div class="g-modal__content">
          <p>Opravdu si přejete smazat tuto konferenci?</p>
          <span>ID: <em>{{ conferenceId }}</em></span>
          <span>Název: <em>{{ conferenceName }}</em></span>
      </div>
      <div class="g-modal__buttons">
          <button class="g-btn g-btn--blue" @click.prevent="closeModal">Zrušit</button>
          <button class="g-btn g-btn--red" @click.prevent="deleteConference">Smazat</button>
      </div>
    </div>
  </div>
</template>