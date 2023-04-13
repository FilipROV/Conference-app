import { defineStore } from 'pinia'
import { auth, db } from '@/firebase/firebase'
import { signOut, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc, getCountFromServer, collection } from "firebase/firestore";
import router from '../router';

export const useAuthStore = defineStore('storeAuth', {
  state: () => {
    return {
      user: {},
      allUsersCount: '',
      flashAlert: {
        message: '',
        type: '',
      }
    }
  },
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
          if (user) {
            //this.setUserRole(user.uid, credentials.rights)
            this.getUser(user.uid)
            this.user.id = user.uid
            this.user.email = user.email
            if (window.location.hash === '#/login' || window.location.hash === '#/register') {
              this.router.push("/")
            }
          } else {
            this.user = {}
          }
        });
        this.allUsersCount()
    },
    async getUser(userID) {
      const docRef = doc(db, "users", userID)
      const docSnap = await getDoc(docRef)
      this.user.role = docSnap.data().role
      this.user.username = docSnap.data().userName
    },
    async setUserRole(userID, userRole, userName) {
      const docRef = doc(db, "users", userID)
      await setDoc(docRef, {
        role: userRole,
        userName: userName 
      })
    },
    async allUsersCount() {
      const coll = collection(db, "users");
      const snapshot = await getCountFromServer(coll);
      this.allUsersCount = snapshot.data().count;
    }, 
    registerUser(credentials) {
      createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
          this.setUserRole(userCredential.user.uid, credentials.rights, credentials.name)
          this.showFlashAlert('Uživatel úspěšně registrován','success')
      })
      .catch((error) => {
          console.log(error.message)
          this.showFlashAlert('Pokus o registraci se nezdařil','fail')
      })
    },
    loginUser(credentials) {
      setPersistence(auth, browserLocalPersistence).then(() => {
        signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((userCredential) => {
            const user = userCredential.user;
            this.showFlashAlert('Přihlášení bylo úspěšné','success')
        })
        .catch((error) => {
          console.log(error.message)
          this.showFlashAlert('Pokus o přihlášení se nezdařil','fail')
        });
      }).catch((error) => {
          console.log(error.message)
      })
    },
    logoutUser() {
      signOut(auth).then(() => {
        this.showFlashAlert('Odhlášení bylo úspěšné','success')
      }).catch((error) => {
        this.showFlashAlert('Odhlášení nebylo úspěšné','fail')
        console.log(error.message)
      })
      router.push('/')
    },
    changeUsersPassword(email) {
      sendPasswordResetEmail(auth, email).then(() => {
        this.showFlashAlert('Email s odkazem na změnu hesla byl odeslán','success')
      }).catch((error) => {
        console.log(error.message);
        this.showFlashAlert('Něco se pokazilo. Email s odkazem na změnu hesla nebyl odeslán','fail')
      })
    },
    showFlashAlert(message, type) {
      const thisOne = this;
      this.flashAlert.message = message;
      this.flashAlert.type = type;
      setTimeout(function () {
          thisOne.flashAlert.message = '';
      }, 2000);
  }

  },
  getters: {
    totalUsersCount: (state) => {
      return state.allUsersCount
    },
  }
})