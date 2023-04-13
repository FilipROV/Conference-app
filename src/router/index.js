import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/storeAuth'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Conferences from '@/components/Conferences.vue'
import Conference from '@/components/Conference.vue'
import CreateConference from '@/components/CreateConference.vue'
import Register from '@/components/Register.vue'
import CreateReview from '@/components/CreateReview.vue'
import Statistics from '@/components/Statistics.vue'
import Reviews from '@/components/Reviews.vue'
import ReviewDetail from '@/components/ReviewDetail.vue'
const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        beforeEnter: (to, from) => {
            const storeAuth = useAuthStore()
            if (storeAuth.user.id) {
                return to.name = '/'
            }
        }
    },
    {
        path: '/conferences',
        name: 'conferences',
        component: Conferences
    },
    {
        path: '/conferences/:id',
        name: 'conference',
        component: Conference
    },
    {
        path: '/createConference',
        name: 'createConference',
        component: CreateConference,
        beforeEnter: (to, from) => {
            const storeAuth = useAuthStore()
            if (!storeAuth.user.id) {
                return to.name = '/login'
            }
            else if (storeAuth.user.role !== 'admin') {
                return to.name = '/'
            }
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        beforeEnter: (to, from) => {
            const storeAuth = useAuthStore()
            if (!storeAuth.user.id) {
                return to.name = '/login'
            }
            else if (storeAuth.user.role !== 'admin') {
                return to.name = '/'
            }
        }
    },
    {
        path: '/createReview',
        name: 'createReview',
        component: CreateReview,
        beforeEnter: (to, from) => {
            const storeAuth = useAuthStore()
            if (!storeAuth.user.id) {
                return to.name = '/login'
            }
            else if (storeAuth.user.role !== 'reviewer') {
                return to.name = '/'
            }
        }
    },
    {
        path: '/statistics',
        name: 'statistics',
        component: Statistics,
        beforeEnter: (to, from) => {
            const storeAuth = useAuthStore()
            if (!storeAuth.user.id) {
                return to.name = '/login'
            }
            else if (storeAuth.user.role !== 'admin') {
                return to.name = '/'
            }
        }
    },
    {
        path: '/reviews',
        name: 'reviews',
        component: Reviews,
        beforeEnter: (to, from) => {
            const storeAuth = useAuthStore()
            if (!storeAuth.user.id) {
                return to.name = '/login'
            }
            else if (storeAuth.user.role !== 'admin') {
                return to.name = '/'
            }
        }
    },
    {
        path: '/reviews/:id',
        name: 'reviewDetail',
        component: ReviewDetail
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router