import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from './pages/layout/Layout.vue'
import HomePage from './pages/home/HomePage.vue'
import AboutPage from './pages/about_project/AboutPage.vue';
import CardPage from './pages/cardPage/CardPage.vue';
import AuthPage from './pages/authPage/AuthPage.vue'
import RegistrationPage from './pages/registration/registrationPage.vue'
/*import AboutPage from '../pages/about_project/AboutPage.vue'
import CardPage from '../pages/cardPage/CardPage.vue'


import FavoritsPage from '../pages/favorits/FavoritsPage.vue'
import BasketPage from '../pages/basket/BasketPage.vue'
import FormOderPage from '../pages/formOder/FormOrder.vue'
import OrderComplited from '../pages/orderComplited/OrderComplited.vue'
import PersonalCabinet from '../pages/personalCabinet/PersonalCabinet.vue'
import NotificationsPage from '../pages/notifications/NotificationsPage.vue'*/

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage
      },
      {
        path: '/about',
        name: 'about',
        component: AboutPage
      },
      {
        path: '/:idCard',
        name: 'card',
        component: CardPage,
      },
      {
        path: '/loginClient',
        name: 'login',
        component: AuthPage
      },
      {
        path: '/registration',
        name: 'registration',
        component: RegistrationPage
      },
      /*
      
      {
        path: '/favoritsProducts',
        name: 'favorits',
        component: FavoritsPage
      },
      {
        path: '/basket',
        name: 'basket',
        component: BasketPage
      },
      {
        path: '/formOrder',
        name: 'formOrder',
        component: FormOderPage
      },
      {
        path: '/orderComplited',
        name: 'orderComplited',
        component: OrderComplited
      },
      {
        path: '/personalCabinet',
        name: 'personalCabinet',
        component: PersonalCabinet
      },
      {
        path: '/notifications',
        name: 'notifications',
        component: NotificationsPage
      }*/
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/store-by-react'), // Базовый путь
  routes
})

export default router