<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useConferencesStore } from '@/stores/storeConferences'
const props = defineProps({
    modelValue: {
        type: Boolean,
        dafault: false
    },
    conferenceId: {
        type: String,
        required: true
    },
    conferenceData: {
        type: Object,
        required: true
    }
})
const storeConferences = useConferencesStore()
const emit = defineEmits(['update:modelValue'])
const closeModal = () => {
    emit('update:modelValue', false)
}

const modalCardRef = ref(null)

onClickOutside(modalCardRef, closeModal)

const handleKeyboard = e => {
    if (e.key === 'Escape') closeModal()
}
const updateConference = () => {
    const data = {
        preTitle: props.conferenceData.preTitle,
        title: props.conferenceData.title,
        date: props.conferenceData.date,
        cooperations: props.conferenceData.cooperations,
        editorData: props.conferenceData.editorData
    }
    storeConferences.updateConference(props.conferenceId, data)
    closeModal()
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
      <span class="g-modal__title">Upravit Konferenci</span>
      <div class="g-modal__content">
        <form class="s-create-conference__form">
            <div class="mb-4 mt-5">
                <input type="text" class="form-control" id="pre-title" v-model="conferenceData.preTitle"  placeholder="Zadejte doplňující název konference">
            </div>
            <div class="mb-4">
                <input type="text" class="form-control" id="title" v-model="conferenceData.title" placeholder="Zadejte název konference">
            </div>
            <div class="mb-4">
                <input type="text" class="form-control" id="date" v-model="conferenceData.date" placeholder="Zadejte datum konference">
            </div>
            <div class="mb-5">
                <input type="text" class="form-control" id="cooperations" v-model="conferenceData.cooperations"  placeholder="Zadejte partnery konference oddělené čárkou">
            </div>
            <div class="mb-4">
                <QuillEditor theme="snow" toolbar="full" v-model:content="conferenceData.editorData" content-type="html" />
            </div>
        </form>
      </div>
      <div class="g-modal__buttons">
          <button class="g-btn g-btn--blue" @click.prevent="closeModal">Zrušit</button>
          <button class="g-btn g-btn--blue" @click.prevent="updateConference">Upravit</button>
      </div>
    </div>
  </div>
</template>