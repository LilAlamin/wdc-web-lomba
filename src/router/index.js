import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: LandingPage,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardPage,
            beforeEnter: (to, from, next) => {
                const isLoggedIn = sessionStorage.getItem('isLoggedIn')
                if (!isLoggedIn) {
                    next({ name: 'login' })
                } else {
                    next()
                }
            },
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return { el: to.hash, behavior: 'smooth' }
        }
        return { top: 0 }
    },
})

export default router
