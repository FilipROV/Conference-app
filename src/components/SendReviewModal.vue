<script setup>
    import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useConferencesStore } from '@/stores/storeConferences'
    import { useAuthStore } from '@/stores/storeAuth'
    import { toDate } from '@/composables/toDate'
    import emailjs from '@emailjs/browser';
    import { Field, Form, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';

    const storeConferences = useConferencesStore()

    const props = defineProps({
        modelValue: {
            type: Boolean,
            dafault: false
        },
        review: {
            type: Object,
            required: true
        }
    })
    const emailParams = reactive({
        send_to: '',
        message: '',
        subject: ''
    })
    const schema = yup.object().shape({
        send_to: yup.string().required('Toto pole je povinné').email('Zadejte prosím validní email'),
        subject: yup.string().required('Toto pole je povinné'),
    })
    const sendEmail = () => {
        if (!emailParams.message) {
            useAuthStore().showFlashAlert('Prosím vyplňte text zprávy','fail')
        }
        else {
            const templateParams = {
                review: `${window.location.origin}/#/reviews/${props.review.id}`,
                conference: `${window.location.origin}/#/conferences/${props.review.conference}`,
                send_to: emailParams.send_to,
                message: emailParams.message,
                subject: emailParams.subject
            }
            emailjs.send('service_5hxdw4p', 'template_w6divik',templateParams,'r9-84n9VAghnejqeI')
            .then((result) => {
                console.log('SUCCESS!', result.text);
                useAuthStore().showFlashAlert('Email byl úspěšně odeslán','success')
            }, (error) => {
                console.log('FAILED...', error.text);
                useAuthStore().showFlashAlert('Email nebyl odeslán','fail')
            })
            closeModal()
        }
    }
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
      <span class="g-modal__title">Odeslat Recenzi</span>
      <div class="g-modal__content">
        <Form @submit="sendEmail" :validation-schema="schema">
            <div class="mb-4">
                <Field type="email" name="send_to" id="send_to" class="form-control" v-model="emailParams.send_to" placeholder="Vyplňte email adresáta" />
                <ErrorMessage name="send_to" class="alert alert-danger"/>
            </div>
            <div class="mb-4">
                <Field type="text" name="subject" id="subject" class="form-control" v-model="emailParams.subject" placeholder="Vyplňte předmět emailu" />
                <ErrorMessage name="subject" class="alert alert-danger"/>
            </div>
            <div class="mb-3">
                <textarea name="message" id="message" class="form-control" v-model="emailParams.message" placeholder="Vaše zpráva..."></textarea>
            </div>
            <div class="g-modal__buttons">
                <button class="g-btn g-btn--blue">Odeslat</button>
                <button class="g-btn g-btn--blue" @click.prevent="closeModal">Zavřít</button>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>