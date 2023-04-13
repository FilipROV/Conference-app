<script setup>
    import { ref, onMounted, onUnmounted, reactive } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useRouter, useRoute } from 'vue-router'
    import { useConferencesStore } from '@/stores/storeConferences'

    const storeConferences = useConferencesStore()
    const router = useRouter()
    const route = useRoute()

    const props = defineProps({
        modelValue: {
            type: Boolean,
            dafault: false
        },
        conferenceId: {
            type: String,
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
    const registeredParticipans = ref('')
    if (storeConferences.getConferenceContent(props.conferenceId).registeredParticipans) {
        registeredParticipans.value = JSON.parse(JSON.stringify(storeConferences.getConferenceContent(props.conferenceId).registeredParticipans))
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
      <span class="g-modal__title">Registrovaní Účastníci</span>
      <div class="g-modal__content">
         <table v-if="registeredParticipans" class="g-modal__table table">
            <tr>
                <th>Jméno</th>
                <th>Příjmení</th>
                <th>E-mail</th>
                <th>Telefon</th>
            </tr>
            <tr v-for="item in registeredParticipans">
                <td>{{item.firstName}}</td>
                <td>{{item.lastName}}</td>
                <td>{{item.email}}</td>
                <td>{{item.phone}}</td>
            </tr>
         </table>
         <span v-else >Na tuto konferenci zatím nebyl nikdo registrován.</span>
      </div>
      <div class="g-modal__buttons">
          <button class="g-btn g-btn--blue" @click.prevent="closeModal">Zavřít</button>
      </div>
    </div>
  </div>
</template>