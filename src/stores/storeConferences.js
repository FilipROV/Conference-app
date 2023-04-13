import { defineStore } from 'pinia'
import { db } from '@/firebase/firebase'
import { collection, onSnapshot, query, orderBy, doc, addDoc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useReviewsStore } from '@/stores/storeReviews'
import { useAuthStore } from '@/stores/storeAuth'

let getConferencesSnapshot = null
let conferencesCollectionRef 
let conferencesCollectionQuery
export const useConferencesStore = defineStore('storeConferences', {
  state: () => {
    return {
      conferences: [],
      conferencesLoaded: false
    }
  },
  actions: {
    init() {
      const storeReviews = useReviewsStore()
      conferencesCollectionRef = collection(db, "conferences")
      conferencesCollectionQuery = query(conferencesCollectionRef, orderBy("createDate", "desc"))
      this.getConferences()
      storeReviews.init()
    },
    async getConferences() {
      this.conferencesLoaded = false
      getConferencesSnapshot = onSnapshot(conferencesCollectionQuery, (querySnapshot) => {
        let conferences = []
        querySnapshot.forEach((doc) => {
            let conference = {
                id: doc.id,
                preTitle: doc.data().preTitle,
                date: doc.data().date,
                title: doc.data().title,
                cooperations: doc.data().cooperations,
                editorData: doc.data().editorData,
                createDate: doc.data().createDate,
                registeredParticipans: doc.data().registeredParticipans
            }
            conferences.push(conference)
        })
        this.conferences = conferences
        this.conferencesLoaded = true
      })         
    },
    async addConference(content) {
      let currentDate = new Date().getTime(),
          createDate = currentDate.toString()
      await addDoc(conferencesCollectionRef, {
          title: content.title,
          preTitle: content.preTitle,
          date: content.date,
          cooperations: content.cooperations,
          editorData: content.editorData, 
          createDate
      }).then(() => {
        useAuthStore().showFlashAlert('Konference byla úspěšně vytvořena','success')
      }).catch((error) => {
        console.log(error.message)
        useAuthStore().showFlashAlert('Konferenci se nepodařilo vytvořit','fail')
      })
    },
    async deleteConference(idToDelete) {
      await deleteDoc(doc(conferencesCollectionRef, idToDelete)).then(() => {
        useAuthStore().showFlashAlert('Konference byla úspěšně smazána','success')
      }).catch((error) => {
        console.log(error.message)
        useAuthStore().showFlashAlert('Konference nemohla být smazána','fail')
      }) 
    },
    async updateConference(id, content) {
      await updateDoc(doc(conferencesCollectionRef, id), {
        title: content.title,
        preTitle: content.preTitle,
        date: content.date,
        cooperations: content.cooperations,
        editorData: content.editorData
      }).then(() => {
        useAuthStore().showFlashAlert('Konference byla úspěšně aktualizována','success')
      }).catch((error) => {
        console.log(error)
        useAuthStore().showFlashAlert('Konferenci nyní nelze aktualizovat','fail')
      })
    },
    async updateRegisteredParticipans(id, participant) {
        await updateDoc(doc(conferencesCollectionRef, id), {
          registeredParticipans: arrayUnion(participant) 
        }).then(() => {
          useAuthStore().showFlashAlert('Registrace na konferenci proběhla úspěšně','success')
        }).catch((error) => {
          console.log(error)
          useAuthStore().showFlashAlert('Nemohli jsme vás na konferenci zaregistrovat','fail')
        })
    }
  },
  getters: {
    getConferenceContent: (state) => {
      return (id) => {
          return state.conferences.filter(item => item.id === id)[0]
      }
    },
    totalConferencesCount: (state) => {
      return state.conferences.length
    },
  } 
})