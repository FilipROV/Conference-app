<script setup>
    import { ref, onMounted, onUnmounted, reactive } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useRouter, useRoute } from 'vue-router'
    import { useConferencesStore } from '@/stores/storeConferences'
    import { Field, Form, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';

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
        },
        conferenceName: {
            type: String,
            required: true
        }
    })
    const participant = reactive({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })
    const phoneRegex = '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$'
    const schema = yup.object().shape({
        firstName: yup.string().required('Toto pole je povinné'),
        lastName: yup.string().required('Toto pole je povinné'),
        email: yup.string().required('Toto pole je povinné').email('Zadejte prosím validní email'),
        phone: yup.string().required('Toto pole je povinné').matches(phoneRegex, 'Zadejte prosím validní telefonní číslo')
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
    const createParticipant = () => {
        let alreadyRegistered = false
        if (storeConferences.getConferenceContent(route.params.id).registeredParticipans) {
            storeConferences.getConferenceContent(route.params.id).registeredParticipans.forEach(item => {
                if (item.email === participant.email) {
                    alreadyRegistered = true
                }
            })
        }
        if (!alreadyRegistered) {
            storeConferences.updateRegisteredParticipans(props.conferenceId, participant)
            closeModal()
        }
        else {
            alert('Zadaný email je již zaregistrován')
        }
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
      <span class="g-modal__title">Registrovat se na konferenci:<br><small>{{ conferenceName }}</small></span>
      <div class="g-modal__content">
         <Form @submit="createParticipant" :validation-schema="schema" class="s-register-to-conference__form">
            <div class="mb-4 mt-5">
                <Field type="text" class="form-control" name="firstName" id="firstName" v-model="participant.firstName" placeholder="Zadejte své křestní jméno"/>
                <ErrorMessage name="firstName" class="alert alert-danger"/>
            </div>
            <div class="mb-4">
                <Field type="text" class="form-control" name="lastName" id="lastName" v-model="participant.lastName" placeholder="Zadejte své přímení"/>
                <ErrorMessage name="lastName" class="alert alert-danger"/>
            </div>
            <div class="mb-4">
                <Field type="email" class="form-control" name="email" id="email" v-model="participant.email" placeholder="Zadejte svou emailovou adresu"/>
                <ErrorMessage name="email" class="alert alert-danger"/>
            </div>
            <div class="mb-4">
                <Field type="tel" class="form-control" name="phone" id="phone" v-model="participant.phone" placeholder="Zadejte své telefonní číslo"/>
                <ErrorMessage name="phone" class="alert alert-danger"/>
            </div>
            <div class="g-modal__buttons">
                <button class="g-btn g-btn--blue" @click.prevent="closeModal">Zrušit</button>
                <button class="g-btn g-btn--blue">Odeslat</button>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>