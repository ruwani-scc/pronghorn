import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      title: 'Dashboard - VacationPlan'
    }
  },
  {
    path: '/itinerary/new',
    name: 'CreateItinerary',
    component: () => import('@/pages/CreateItinerary.vue'),
    meta: {
      title: 'Create Itinerary - VacationPlan'
    }
  },
  {
    path: '/itinerary/:id',
    name: 'ItineraryDetail',
    component: () => import('@/pages/ItineraryDetail.vue'),
    meta: {
      title: 'Itinerary Details - VacationPlan'
    }
  },
  {
    path: '/itinerary/:id/edit',
    name: 'EditItinerary',
    component: () => import('@/pages/EditItinerary.vue'),
    meta: {
      title: 'Edit Itinerary - VacationPlan'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: 'Page Not Found - VacationPlan'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 'VacationPlan'
  next()
})

export default router
