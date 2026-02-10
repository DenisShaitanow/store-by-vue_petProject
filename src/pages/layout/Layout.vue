<template>
  <div :class="$style.layout">
    <HeaderUI
      v-if="!isRegistrationPage"
      :handle-click-logout="handleClickLogout"
      :user="user"
      :on-login-click="handleLogin"
      :on-register-click="handleRegister"
      :is-modal="false"
      :is-auth="isAuth"
      :is-notification="false"
      :theme="theme"
      @logout="handleLogout"
    />

    <router-view />
  </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { getCookie } from '../../services/cookie'
    import HeaderUI from '../../ui/header/Header.vue'
    import type { RegistrationData } from '../../types/index'
    import { useTypedStore } from '../../store/index';

    // Композиции Vue
    const route = useRoute()
    const router = useRouter()
    const store =  useTypedStore()

    // Реактивные состояния
    const theme = ref<'light' | 'dark'>('light')

    // Вычисляемые свойства
    const isRegistrationPage: boolean = computed(() => {
    return route.path === '/registration' || route.path === '/loginClient'
    })

    const isAuth = computed(() => {
    return store.getters['user/selectIsAuth'] || false
    })

    const user = computed<RegistrationData | null>(() => {
    return store.getters['user/selectUser'] || null
    })

    // Методы
    const handleLogin = () => {
        router.push('/loginClient')
    }

    const handleRegister = () => {
        router.push('/registration')
    }

    const handleClickLogout = () => {
        store.dispatch('user/logoutUser')
    }

    const handleLogout = () => {
    // Обработка события logout от HeaderUI
    handleClickLogout()
    }

    const checkUserAuth = () => {
        const accessToken = getCookie('accessToken') || ''
        if (accessToken) {
            store.dispatch('user/checkUserAuth', accessToken)
        }
    }

    // Хуки жизненного цикла
    onMounted(() => {
    checkUserAuth()
    
    // Здесь можно добавить логику для получения темы из контекста или хранилища
    // Например, из localStorage или Vuex
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
        theme.value = savedTheme
    }
    })


</script>

<style module scoped>
    .layout {
    display: flex;
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 321px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-inline: 25px;
    max-inline-size: 1960px;
    gap: 50px;
    margin: auto;
    background-color: var(--background-page-color);
    }

    @media (769px <= width <= 1025px) {
    .layout {
        gap: 40px;
    }
    }

    @media (625px <= width <= 768px) {
    .layout {
        gap: 30px;
        padding-inline: 20px;
    }
    }

    @media (481px <= width <= 624px) {
    .layout {
        gap: 22px;
        padding-inline: 12px;
    }
    }

    @media (386px <= width <= 480px) {
    .layout {
        gap: 16px;
        padding-inline: 10px;
    }
    }

    @media (width <= 385px) {
    .layout {
        gap: 12px;
        padding-inline: 10px;
    }
    }

</style>