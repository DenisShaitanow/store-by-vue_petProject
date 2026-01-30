<template>
  <button
    :data-cy="dataCy"
    type="button"
    :class="[
      $style.button,
      type === 'like' ? $style.like : '',
      isToggle && ariaPressed ? $style.pressed : '',
      type === 'like' && isLiked ? $style.accent : '',
      className
    ].filter(Boolean).join(' ')"
    :aria-label="computedAriaLabel"
    :aria-pressed="isToggle ? ariaPressed : undefined"
    @click="onClick"
    :disabled="disabled"
  >
    <component :is="IconComponent" :class="$style.icon" />
    <span
      v-if="type === 'notification' && hasNotification"
      :class="$style.notificationDot"
      aria-hidden="true"
    />
    <span
      v-if="type === 'basket' && hasItemsInBasket"
      :class="$style.basketIndicator"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
    import { computed, defineProps, watch } from 'vue'
    import NotificationIcon from '../assets/notification.svg'
    import LikeIcon from '../assets/like.svg'
    import ShareIcon from '../assets/share.svg'
    import MoreSquareIcon from '../assets/more-square.svg'
    import MoonIcon from '../assets/moon.svg'
    import SunIcon from '../assets/sun.svg'
    import BasketIcon from '../assets/basket_header.svg'

    export type ThemeMode = 'light' | 'dark'

    export interface IconButtonBaseProps {
        type: 'like' | 'notification' | 'share' | 'more' | 'theme' | 'basket'
        onClick?: () => void
        ariaLabel?: string
        pressed?: boolean
        className?: string
        disabled?: boolean
        dataCy?: string
    }

    export interface LikeProps extends IconButtonBaseProps {
        type: 'like'
        isLiked?: boolean
    }

    export interface NotificationProps extends IconButtonBaseProps {
        type: 'notification'
        hasNotification?: boolean
    }

    export interface ShareProps extends IconButtonBaseProps {
        type: 'share'
    }

    export interface MoreProps extends IconButtonBaseProps {
        type: 'more'
    }

    export interface ThemeProps extends IconButtonBaseProps {
    type: 'theme'
    themeMode: ThemeMode
    }

    export interface BasketProps extends IconButtonBaseProps {
    type: 'basket'
    }

    export type IconButtonProps =
    | LikeProps
    | NotificationProps
    | ShareProps
    | MoreProps
    | ThemeProps
    | BasketProps

    // Props с проверкой типа в зависимости от переданного type
    const props = defineProps<IconButtonProps>()

    // Вместо useAppSelector используем props или composable для получения состояния корзины
    // Предполагаем, что productsInBasket передаются через props или получаются из store
    const productsInBasket: any[] = [] // Заменить на реальное получение данных из Vuex/Pinia
    const hasItemsInBasket = computed(() => productsInBasket.length > 0)

    const computedAriaLabel = computed(() => {
    if (props.ariaLabel) return props.ariaLabel
    
    switch (props.type) {
        case 'like':
        return (props as LikeProps).isLiked ? 'Убрать лайк' : 'Поставить лайк'
        case 'notification':
        return (props as NotificationProps).hasNotification ? 'Новые уведомления' : 'Уведомления'
        case 'share':
        return 'Поделиться'
        case 'more':
        return 'Ещё'
        case 'theme':
        return (props as ThemeProps).themeMode === 'dark' 
            ? 'Сменить тему на светлую' 
            : 'Сменить тему на тёмную'
        case 'basket':
        return 'Открыть корзину'
        default:
        return 'Кнопка'
    }
    })

    const isToggle = computed(() => 
    ['like', 'notification', 'theme', 'basket'].includes(props.type)
    )

    const ariaPressed = computed(() => {
    if (typeof props.pressed === 'boolean') return props.pressed
    
    switch (props.type) {
        case 'like':
        return !!(props as LikeProps).isLiked
        case 'notification':
        return !!(props as NotificationProps).hasNotification
        case 'theme':
        return (props as ThemeProps).themeMode === 'dark'
        default:
        return undefined
    }
    })

    const IconComponent = computed(() => {
    switch (props.type) {
        case 'like':
        return LikeIcon;
        case 'notification':
        return NotificationIcon;
        case 'share':
        return ShareIcon;
        case 'more':
        return MoreSquareIcon;
        case 'theme':
        return (props as ThemeProps).themeMode === 'light' ? SunIcon : MoonIcon;
        case 'basket':
        return BasketIcon;
        default:
        return ShareIcon;
    }
    })

    const buttonClasses = computed(() => {
    const classes = ['button']
    
    if (props.type === 'like') classes.push('like')
    if (isToggle.value && ariaPressed.value) classes.push('pressed')
    if (props.type === 'like' && (props as LikeProps).isLiked) classes.push('accent')
    if (props.className) classes.push(props.className)
    
    return classes.join(' ')
    })
</script>

<style module scoped>
    .button {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    padding: 0;
    color: var(--text-color);
    background-color: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
    color 0.25s ease-in-out,
    transform 0.1s ease-in-out;
    }

    .button svg {
  fill: var(--text-color);
}

    .button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    }

    .button:active {
    transform: scale(0.96);
    }

    .pressed {
    color: var(--accent-color);
    }

    .accent {
    color: var(--accent-color);
    }

    .icon {
    display: block;
    width: 24px;
    height: 24px;
    pointer-events: none;
    }

    .like .icon path {
    fill-opacity: 0;
    transition: fill-opacity 0.3s ease-in-out;
    }

    .like.accent .icon path {
    fill-opacity: 1;
    }

    .notificationDot {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: var(--alarm-color);
    border-radius: 50%;
    }

    .basketIndicator {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: var(--alarm-color);
    border-radius: 50%;
    }

    @media (625px <= width <= 900px) {
    .button {
        width: 16px;
        height: 16px;
    }

    .icon {
        width: 16px;
        height: 16px;
    }

    .basketIndicator {
        width: 7px;
        height: 7px;
    }
    }

    @media (481px <= width <= 624px) {
    .button {
        width: 12px;
        height: 12px;
    }

    .icon {
        width: 12px;
        height: 12px;
    }

    .basketIndicator {
        width: 5px;
        height: 5px;
    }
    }

    @media (width <= 480px) {
    .button {
        width: 9px;
        height: 9px;
    }

    .icon {
        width: 9px;
        height: 9px;
    }

    .basketIndicator {
        width: 3px;
        height: 3px;
    }
    }

</style>