<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/storeAuth'
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import ForgottenPassword from '@/components/ForgottenPassword.vue';

const credentials = reactive({
  email: '',
  password: ''
})
const schema = yup.object().shape({
  email: yup.string().required('Toto pole je povinné').email('Zadejte prosím validní email'),
  password: yup.string().required('Toto pole je povinné')
})

const router = useRouter()
const storeAuth = useAuthStore()
const forgottenPass = ref(false)
const onSubmit = () => {
  if (!credentials.email || !credentials.password) {
    alert('Zadejte prosím email a heslo')
  }
  else {
    storeAuth.loginUser(credentials)
  }
}
</script>
<template>
  <section class="s-login-form">
    <div class="container">
      <div class="s-login-form__wrapper">
        <h1 class="s-login-form__title">Přihlašte se</h1>
        <Form @submit="onSubmit" :validation-schema="schema">
          <div class="s-login-form__row">
            <Field type="email" class="text-input" name="email" id="email" v-model="credentials.email" placeholder="Zadejte přihlašovací e-mail" />
            <ErrorMessage name="email" class="alert alert-danger"/>
          </div>
          <div class="s-login-form__row">
            <Field type="password" class="text-input" name="password" id="password" v-model="credentials.password" placeholder="Zadejte heslo" />
            <ErrorMessage name="password" class="alert alert-danger"/>
          </div>
          <div class="s-login-form__row">
            <button>Přihlásit se</button>
          </div>
          <div class="s-login-form__row">
            <button @click.prevent="forgottenPass = true" class="forgot-pass">Zapomenuté heslo</button>
          </div>
        </Form>
        <transition>
          <ForgottenPassword v-if="forgottenPass" v-model="forgottenPass"></ForgottenPassword>
        </transition>
      </div>
    </div>
  </section>
</template>
