<script setup>
import { ref, reactive } from 'vue' 
import { useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useConferencesStore } from '@/stores/storeConferences';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const storeConferences = useConferencesStore()
const router = useRouter()

const conferenceData = reactive({
  preTitle: '',
  title: '',
  date: '',
  cooperations: '',
  editorData: ''
})
const cooperationsRegex = '^[\w\s]+(?:;[\w\s]+)*$'
const schema = yup.object().shape({
  preTitle: yup.string().required('Toto pole je povinné'),
  title: yup.string().required('Toto pole je povinné'),
  date: yup.string().required('Toto pole je povinné'),
  cooperations: yup.string().required('Toto pole je povinné'),
})

const addConferencee = () => {
  const data = {
    preTitle: conferenceData.preTitle,
    title: conferenceData.title,
    date: conferenceData.date,
    cooperations: conferenceData.cooperations,
    editorData: conferenceData.editorData
  }
  storeConferences.addConference(data)
  router.push('/conferences')
}

const deleteForm = () => {
  conferenceData.preTitle = ''
  conferenceData.title = ''
  conferenceData.date = ''
  conferenceData.cooperations = ''
  conferenceData.editorData = ''
  document.querySelector('.ql-editor').innerHTML = ''
}
</script>
<template>
  <section class="s-create-conference">
    <div class="container">
      <div class="s-create-conference__wrapper">
        <div class="row">
          <div class="col-12"> 
            <h1 class="s-create-conference__title text-center">Vytvořit Konferenci</h1>
          </div>
        </div>
        <Form @submit="addConferencee" :validation-schema="schema" class="s-create-conference__form">
          <div class="mb-4 mt-5">
            <Field type="text" class="form-control" name="preTitle" id="preTitle" v-model="conferenceData.preTitle" placeholder="Zadejte doplňující název konference" />
            <ErrorMessage name="preTitle" class="alert alert-danger"/>
          </div>
          <div class="mb-4">
            <Field type="text" class="form-control" name="title" id="title" v-model="conferenceData.title" placeholder="Zadejte název konference"/>
            <ErrorMessage name="title" class="alert alert-danger"/>
          </div>
          <div class="mb-4">
            <Field type="text" class="form-control" name="date" id="date" v-model="conferenceData.date" placeholder="Zadejte datum konference"/>
            <ErrorMessage name="date" class="alert alert-danger"/>
          </div>
          <div class="mb-5">
            <Field type="text" class="form-control" name="cooperations" id="cooperations" v-model="conferenceData.cooperations" placeholder="Zadejte partnery konference oddělené středníkem"/>
            <ErrorMessage name="cooperations" class="alert alert-danger"/>
          </div>
          <div class="mb-4">
            <QuillEditor theme="snow" toolbar="full" v-model:content="conferenceData.editorData" content-type="html" />
          </div>
          <div class="row justify-content-sm-end">
            <div class="col-12 col-sm-auto d-flex flex-column d-sm-block">
              <button @click.prevent="deleteForm" class="g-btn g-btn--red">Vymazat formulář</button>
              <button class="g-btn g-btn--blue">Vytvořit</button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </section>
</template>