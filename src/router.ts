import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from './pages/layout/Layout.vue';
import HomePage from './pages/home/HomePage.vue';
import AboutPage from './pages/about_project/AboutPage.vue';
import CardPage from './pages/cardPage/CardPage.vue';
import AuthPage from './pages/authPage/AuthPage.vue';
import RegistrationPage from './pages/registration/registrationPage.vue';
import FavoritsPage from './pages/favoritsPage/FavoritsPage.vue';
import BasketPage from './pages/basket/BasketPage.vue';
import NotificationsPage from './pages/notifications/NotificationsPage.vue';
import FormOderPage from './pages/formOrder/FormOrder.vue';
import OrderComplited from './pages/orderComplited/OrderComplited.vue';
import PersonalCabinet from './pages/personalCabinet/PersonalCabinet.vue';
import PageNotFound from './pages/404/PageNotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
      },
      {
        path: '/about',
        name: 'about',
        component: AboutPage,
      },

      {
        path: '/loginClient',
        name: 'login',
        component: AuthPage,
      },
      {
        path: '/registration',
        name: 'registration',
        component: RegistrationPage,
      },
      {
        path: '/favoritsProducts',
        name: 'favorits',
        component: FavoritsPage,
      },
      {
        path: '/basket',
        name: 'basket',
        component: BasketPage,
      },
      {
        path: '/notifications',
        name: 'notifications',
        component: NotificationsPage,
      },
      {
        path: '/formOrder',
        name: 'formOrder',
        component: FormOderPage,
      },
      {
        path: '/orderComplited',
        name: 'orderComplited',
        component: OrderComplited,
      },

      {
        path: '/personalCabinet',
        name: 'personalCabinet',
        component: PersonalCabinet,
      },
      {
        path: '/:idCard',
        name: 'card',
        component: CardPage,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*', // Правильный синтаксис для Vue Router 4
    name: '404',
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory('/store-by-react'), // Базовый путь
  routes,
});

export default router;
