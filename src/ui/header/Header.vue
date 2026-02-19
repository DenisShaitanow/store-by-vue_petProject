<template>
  <!-- Modal header -->
  <div v-if="isModal" :class="$style.header">
    <div :class="$style.logoContainer" @click="handleClickLogo">
      <Logo />
    </div>
    <ButtonUI
      :class="$style.closeButton"
      label="Закрыть"
      @click="handleCloseButtonClick"
      tertiary
    >
      <img :src="CrossSvg" alt="Закрыть" />
    </ButtonUI>
  </div>

  <!-- Regular header -->
  <div v-else :class="$style.header">
    <div
      data-cy="headerLogo"
      :class="$style.logoContainer"
      @click="handleClickLogo"
    >
      <Logo />
    </div>
    
    <div :class="$style.menu">
      <router-link to="/about" :class="$style.link">
        О проекте
      </router-link>
    </div>

    <div :class="$style.toolbar">
      <IconButton
        type="theme"
        :theme-mode="theme === 'dark' ? 'dark' : 'light'"
        @click="toggleThemeClick"
        aria-label="Переключить тему"
        data-cy="sun"
      />
      
      <template v-if="isAuth">
        <IconButton
          type="like"
          :is-liked="false"
          aria-label="Избранное"
          @click="handleFavorits"
        />

        <IconButton
          data-cy="basketHeaderButton"
          type="basket"
          aria-label="Корзина выбранных товаров"
          @click="handleBasket"
        />

        <IconButton
          type="notification"
          data-cy="headerButtonNotification"
          aria-label="Открыть список уведомлений"
          @click="handleOpenNotifications"
        />
      </template>
    </div>

    <div v-if="isAuth" :class="$style.profile">
      <UserDropdownMenu
        :user="{
          nameUser: user?.name || regData.name || '',
          avatarUrl: avatarUrl,
        }"
        @personal-cabinet-click="handlePersonalCabinet"
        @logout-click="handleLogout"
        placement="bottom-right"
      />
    </div>

    <div v-else>
      <div :class="$style.authButtons_container">
        <ButtonUI
          :class="$style.loginButton"
          label="Войти"
          @click="onLoginClick"
          secondary
          data-cy="Войти"
        />
        <ButtonUI
          :class="$style.registerButton"
          label="Зарегистрироваться"
          @click="onRegisterClick"
          :secondary="false"
          data-cy="registrationButton"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { inject, ref, computed, onMounted, defineProps, defineEmits } from 'vue'
    import { useRouter } from 'vue-router'
    import CrossSvg from '../assets/cross.svg'
    import ButtonUI from '../button/Button.vue'
    import Logo from '../logo/Logo.vue'
    import IconButton from '../iconButton/IconButton.vue'
    import UserDropdownMenu from '../userDropdownMenu/UserDropdownMenu.vue'
    import type { RegistrationData } from '../../types/index'

    // Определяем пропсы
    interface Props {
    isModal: boolean
    isAuth: boolean
    isNotification: boolean
    user?: RegistrationData
    theme: 'light' | 'dark'
    navItems?: Array<{ label: string; href: string }>
    handleClickLogout?: () => void
    onRegisterClick?: () => void
    onLoginClick?: () => void
    onLogoutClick?: () => void
    handleCloseButtonClick?: () => void
    }

    const props = defineProps<Props>()

    // Emits для событий
    const emit = defineEmits<{
    toggleTheme: []
    logout: []
    }>()

    // Композиции Vue
    const router = useRouter()

    // Состояния
    const regData = ref<RegistrationData>({
    email: '',
    password: '',
    name: '',
    surname: '',
    avatar: '',
    gender: '',
    location: '',
    birthdayDate: '',
    })

    const { toggleTheme } = inject('theme');

    // Вычисляемые свойства
    const avatarUrl = computed(() => {
    if (props.user?.avatar) return props.user.avatar
    if (regData.value?.avatar) return regData.value.avatar
    return ''
    })

    // Методы
    const handleClickLogo = () => {
      router.push('/')
    }

    const handleFavorits = () => {
    router.push('/favoritsProducts')
    }

    const handleBasket = () => {
    router.push('/basket')
    }

    const handleOpenNotifications = () => {
    router.push('/notifications')
    }

    const handlePersonalCabinet = () => {
    router.push('/personalCabinet')
    }

    const handleLogout = () => {
    if (props.handleClickLogout) {
        props.handleClickLogout()
    }
    }

    const toggleThemeClick = () => {
      toggleTheme()
    }

    // Хуки жизненного цикла
    onMounted(() => {
    // Загрузка данных из localStorage
    try {
        const storedRegData = localStorage.getItem('regData')
        if (storedRegData) {
        regData.value = JSON.parse(storedRegData)
        }
    } catch (err) {
        console.error('Ошибка парсинга регистрационных данных:', err)
    }
    })
</script>

<style module scoped>
    .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: center;
    max-width: 1440px;
    min-width: 320px;
    width: 90%;
    background-color: rgba(
        var(--accent-color-r),
        var(--accent-color-g),
        var(--accent-color-b),
        0.2
    );
    padding-block: 21px 20px;
    padding-inline: 40px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    }

    .menu {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 24px;
    }

    .link {
    color: var(--text-color);
    text-decoration: none;
    text-wrap: nowrap;
    }

    .toolbar {
    display: flex;
    align-items: center;
    gap: 20px;
    }

    .dropdownButton {
    gap: 4px;
    background-color: transparent !important;
    }

    .authButtons_container {
    display: flex;
    gap: 8px;
    }

    .loginButton {
    width: 98px;
    }

    .registerButton {
    width: 208px;
    }

    .closeButton {
    gap: 8px;
    width: 147px;
    }

    .searchBox {
    flex: 1 1 auto;
    min-width: 200px;
    }

    .logoContainer {
    inline-size: fit-content;
    block-size: fit-content;
    }

    .logoContainer:hover {
    cursor: pointer;
    }

    @media (625px <= width <= 900px) {
    .header {
        padding-inline: 20px;
        padding-block: 12px 11px;
    }

    .toolbar {
        gap: 14px;
    }

    .link {
        font-size: 12px;
    }

    .loginButton {
        width: 68px;
        padding: 10px 5px;
    }

    .registerButton {
        width: 158px;
        padding: 10px 5px;
    }
    }

    @media (481px <= width <= 624px) {
    .header {
        padding-inline: 15px;
        padding-block: 9px 8px;
    }

    .toolbar {
        gap: 10px;
    }

    .link {
        font-size: 10px;
    }

    .registerButton {
        width: 128px;
    }

    .loginButton {
        width: 58px;
    }
    }

    @media (width <= 480px) {
    .header {
        padding-inline: 9px;
        padding-block: 7px 6px;
    }

    .toolbar {
        gap: 5px;
    }

    .link {
        font-size: 8px;
    }

    .loginButton {
        width: 40px;
    }

    .registerButton {
        width: 103px;
    }
    }
</style>