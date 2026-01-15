

<script setup lang="ts">


import { ref, computed, onMounted, defineEmits, withDefaults, defineProps, onUnmounted, watch, nextTick } from 'vue'
import type { PlacementType } from './type'

interface Props {

  /** Открыто ли меню */
  isOpen?: boolean
  /** Колбэк при изменении состояния */
  onToggle?: (isOpen: boolean) => void
  /** Позиционирование */
  placement?: PlacementType
  /** Смещение в px */
  offset?: number
  /** Закрывать при клике вне */
  closeOnClickOutside?: boolean
  /** Закрывать по Escape */
  closeOnEscape?: boolean
  /** Отключено ли */
  disabled?: boolean
  /** CSS класс контейнера */
  className?: string
  /** CSS класс dropdown */
  dropdownClassName?: string
  /** Aria-label */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-left',
  offset: 4,
  closeOnClickOutside: true,
  closeOnEscape: true,
  disabled: false,
  isOpen: false
})

const emit = defineEmits<{
 
  /** Для поддержки v-model:isOpen */
  'update:isOpen': [isOpen: boolean]
}>();

watch(() => props.isOpen, () => {
  console.log(props.isOpen)
})



// Реактивное состояние
const internalIsOpen = ref(false)
const containerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

// Вычисляемое свойство для isOpen
const isOpen = computed<boolean>(() => 
  props.isOpen ?? internalIsOpen.value
)


const handleTriggerClick = () => {
  emit('update:isOpen', true)
}

const handleTriggerKeyDown = (e: KeyboardEvent) => {
  if (['Enter', ' '].includes(e.key)) {
    e.preventDefault()
    emit('update:isOpen', true)
  } else if (e.key === 'Escape' && props.closeOnEscape) {
    e.preventDefault()
    emit('update:isOpen', false)
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (
    isOpen.value && 
    props.closeOnClickOutside &&
    containerRef.value &&
    !containerRef.value.contains(e.target as Node) &&
    dropdownRef.value &&
    !dropdownRef.value.contains(e.target as Node)
  ) {
    emit('update:isOpen', false)
  }
}

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value && props.closeOnEscape) {
    emit('update:isOpen', false)
  }
}

const focusFirstFocusableElement = () => {
  if (!dropdownRef.value) return
  
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')
  
  const focusable = dropdownRef.value.querySelector(focusableSelectors) as HTMLElement
  focusable?.focus()
}

// Добавляем глобальные обработчики
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
  <div 
    ref="containerRef"
    :class="['base-dropdown-wrapper', className]"
    data-testid="base-dropdown-wrapper"
  >
    <!-- Триггер (slot) -->
    <div
      :class="['base-dropdown-trigger', {    }]"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeyDown"
      :tabindex="disabled ? -1 : 0"
      role="button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-label="ariaLabel"
      data-testid="base-dropdown-trigger"
    >
      <!-- Slot для триггера -->
      <slot name="trigger">
        <!-- Fallback если slot не предоставлен -->
        
      </slot>
    </div>

    <!-- Dropdown контент -->
    <div
      v-if="isOpen"
      ref="dropdownRef"
      :class="[
        'base-dropdown-content',
        `placement-${placement}`,
        dropdownClassName
      ]"
      :style="{ '--offset': `${offset}px` }"
      role="menu"
      aria-hidden="false"
      data-testid="base-dropdown-content"
    >
      <!-- Slot для контента -->
      <slot>
        <!-- Fallback если slot не предоставлен -->
        
      </slot>
    </div>
  </div>
</template>
    
<style module scoped lang="css">
    :root {
      --dropdown-border: #e5e7eb;
      --dropdown-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --dropdown-radius: 8px;
      --dropdown-offset: 4px;
      --dropdown-z-index: 1000;
      --dropdown-transition: all 0.2s ease-in-out;
    }
    
    .container {
      position: relative;
      display: inline-block;
    }
    
    .container.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
    
    .trigger {
      display: inline-block;
      cursor: pointer;
    }
    
    .trigger:focus-visible {
      border-radius: 4px;
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
    }
    
    .dropdown {
      position: absolute;
      z-index: var(--dropdown-z-index);
      background: var(--surface-color);
      border: 1px solid var(--dropdown-border);
      border-radius: var(--dropdown-radius);
      box-shadow: var(--dropdown-shadow);
      visibility: hidden;
      transform: translateY(-8px);
      opacity: 0;
      transition: var(--dropdown-transition);
      pointer-events: none;
      background-color: var(--background-page-color);
    }
    
    .dropdown.open {
      visibility: visible;
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    
    .placement-bottom-left {
      top: calc(100% + var(--dropdown-offset));
      left: 0;
    }
    
    .placement-bottom-right {
      top: calc(100% + var(--dropdown-offset));
      right: 0;
    }
    
    .placement-top-left {
      bottom: calc(100% + var(--dropdown-offset));
      left: 0;
    }
    
    .placement-top-right {
      right: 0;
      bottom: calc(100% + var(--dropdown-offset));
    }
    
    .content {
      padding: 8px;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .dropdown {
        transition: none;
      }
    }
</style>