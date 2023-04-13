<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/storeAuth'
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const storeAuth = useAuthStore()

const credentials = reactive({
  email: '',
  password: '',
  name: '',
  rights: 'reviewer'
})
const schema = yup.object().shape({
  username: yup.string().required('Toto pole je povinné'),
  email: yup.string().required('Toto pole je povinné').email('Zadejte prosím validní email'),
  password: yup.string().required('Toto pole je povinné').min(6,'Heslo musí mít minimálně 6 znaků'),
  passwordConfirmation: yup
    .string()
    .required('Toto pole je povinné')
    .oneOf([yup.ref('password')], 'Hesla se neshodují'),
})
const onSubmit = () => {
  if (!credentials.email || !credentials.password || !credentials.name) {
    alert('Vyplňte prosím všechny pole.')
  }
  else {
    storeAuth.registerUser(credentials)
  }
}
</script>
<template>
  <section class="s-register-form">
    <div class="container">
      <div class="row">
        <div class="s-register-form__wrapper">
          <h1 class="s-register-form__title">Zaregistrovat uživatele</h1>
          <Form @submit="onSubmit" :validation-schema="schema">
            <div class="s-register-form__row">
              <Field type="text" class="text-input" v-model="credentials.name" name="username" id="username" placeholder="Vyplňte Jméno"/>
              <ErrorMessage name="username" class="alert alert-danger"/>
            </div>
            <div class="s-register-form__row">
              <Field type="email" class="text-input" v-model="credentials.email" name="email" id="email" placeholder="Vyplňte email"/>
              <ErrorMessage name="email" class="alert alert-danger"/>
            </div>
            <div class="s-register-form__row">
              <Field type="password" class="text-input" v-model="credentials.password" name="password" id="password" placeholder="Vyplňte heslo"/>
              <ErrorMessage name="password" class="alert alert-danger"/>
            </div>
            <div class="s-register-form__row">
              <Field type="password" class="text-input" name="passwordConfirmation" id="passwordConfirmation" placeholder="Potvrďte heslo"/>
              <ErrorMessage name="passwordConfirmation" class="alert alert-danger"/>
            </div>
            <div class="s-register-form__row justify-content-start">
              <fieldset>
                <div class="d-flex mb-2">
                  <input type="radio" id="admin" name="rights" value="admin" v-model="credentials.rights">
                  <label for="admin">Zaregistrovat jako administrátora</label>
                </div>
                <div class="d-flex">
                  <input type="radio" id="reviewer" name="rights" value="reviewer" v-model="credentials.rights">
                  <label for="reviewer">Zaregistrovat jako recenzenta</label>
                </div>
            </fieldset>
            </div>
            <div class="s-register-form__row">
              <button>Zaregistrovat</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </section>
</template>