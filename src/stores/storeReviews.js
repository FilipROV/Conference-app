import { defineStore } from 'pinia'
import { db } from '@/firebase/firebase'
import { collection, onSnapshot, query, orderBy, setDoc, doc, where, writeBatch, getDocs} from "firebase/firestore";
import { useAuthStore } from '@/stores/storeAuth' 

let getReviewsSnapshot = null
let reviewsCollectionRef
let reviewsCollectionQuery
export const useReviewsStore = defineStore('storereviews', {
  state: () => {
    return {
      reviews: [],
      reviewsLoaded: false
    }
  },
  actions: {
    init() {
      reviewsCollectionRef = collection(db, "reviews")
    },
    async getReviews(conferenceID) {
      this.reviewsLoaded = false
      reviewsCollectionQuery = query(reviewsCollectionRef, where("conference","==", conferenceID),orderBy("createDate", "desc"))
      getReviewsSnapshot = onSnapshot(reviewsCollectionQuery, (querySnapshot) => {
        let reviews = []
        querySnapshot.forEach((doc) => {
            let review = {
                id: doc.id,
                conference: doc.data().conference,
                articleForReview: doc.data().articleForReview,
                author: doc.data().author,
                blocks: doc.data().blocks,
                publicComments: doc.data().publicComments,
                privateComments: doc.data().privateComments,
                createDate: doc.data().createDate,
                overallRecomendation: doc.data().overallRecomendation
            }
            reviews.push(review)
        })
        this.reviews = reviews
        this.reviewsLoaded = true
      })         
    },
    async getAllReviews() {
      this.reviewsLoaded = false
      reviewsCollectionQuery = query(reviewsCollectionRef, orderBy("createDate", "desc"))
      getReviewsSnapshot = onSnapshot(reviewsCollectionQuery, (querySnapshot) => {
        let reviews = []
        querySnapshot.forEach((doc) => {
            let review = {
                id: doc.id,
                conference: doc.data().conference,
                articleForReview: doc.data().articleForReview,
                author: doc.data().author,
                blocks: doc.data().blocks,
                publicComments: doc.data().publicComments,
                privateComments: doc.data().privateComments,
                createDate: doc.data().createDate,
                overallRecomendation: doc.data().overallRecomendation
            }
            reviews.push(review)
        })
        this.reviews = reviews
        this.reviewsLoaded = true
      })         
    },
    async addReview(content, reviewID) {
      let currentDate = new Date().getTime(),
          createDate = currentDate.toString()
      await setDoc(doc(db, "reviews", reviewID), {
          conference: content.conference,
          articleForReview: content.articleForReview,
          blocks: content.blocks,
          author: content.author,
          publicComments: content.publicComments,
          privateComments: content.privateComments,
          overallRecomendation: content.overallRecomendation, 
          createDate
      }).then(() => {
        useAuthStore().showFlashAlert('Recenze byla úspěšně vytvořena','success')
      }).catch((error) => {
        console.log(error.message)
        useAuthStore().showFlashAlert('Recenze nebylo možné nyní vytvořit','fail')
      })
    },
    async deleteReviews(conferenceID) {
      reviewsCollectionQuery = query(reviewsCollectionRef, where("conference","==", conferenceID))
      const batch = writeBatch(db)
      const getReviewsSnapshot = await getDocs(reviewsCollectionQuery)
      getReviewsSnapshot.forEach(doc => batch.delete(doc.ref))
      batch.commit()
    },
  },
  getters: {
    totalReviewsCount: (state) => {
      return state.reviews.length
    },
    getReviewContent: (state) => {
      return (id) => {
          return state.reviews.filter(item => item.id === id)[0]
      }
    },
  }
})