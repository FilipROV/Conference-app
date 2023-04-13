<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/storeAuth'
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const email = ref('')
const schema = yup.object().shape({
  email: yup.string().required().email()
})
const storeAuth = useAuthStore()
const props = defineProps({
  modelValue: {
      type: Boolean,
      dafault: false
  }
})
const emit = defineEmits(['update:modelValue'])
const changePassword = () => {
  if (!email.value == null || !email.value == "") {
    storeAuth.changeUsersPassword(email.value)
    closeModal()
  }
  else {
    alert('Zadejte prosím platný email.')
  }
}
const closeModal = () => {
   emit('update:modelValue', false)
}
</script>
<template>
  <section class="g-modal">
    <div class="g-modal__window">
      <Form @submit="changePassword" :validation-schema="schema" class="s-forgotten-password-form">
        <div class="s-forgotten-password-form__row">
          <Field type="email" v-model="email" id="email" name="email" placeholder="Vyplňte email"/>
          <ErrorMessage name="email" class="alert alert-danger"/>
        </div>
        <div class="s-forgotten-password-form__row">
          <button>Požádat o změnu hesla</button>
          <button class="close" @click.prevent="closeModal">Zavřít</button>
        </div>
      </Form>
    </div>
  </section>
</template>