<template>
  <div :class="containerClasses">
    <!-- Если элементов меньше или равно максимальному - просто показываем все -->
    <template v-if="children.length <= maxVisibleItems">
      <slot />
    </template>

    <!-- Если элементов больше - показываем с кнопкой -->
    <template v-else>
      <!-- Всегда видимые элементы -->
      <template v-for="(child, index) in visibleItems" :key="child.key || index">
        <component :is="child" />
      </template>

      <!-- Дополнительные элементы с анимацией -->
      <div
        :class="[
          additionalItemsClassName || $style.additionalItems,
          {
            [$style.additionalItems_expanded]: isExpanded && !additionalItemsExpandedClassName,
            [$style.additionalItems_noAnimation]: disableAnimation,
          },
          additionalItemsExpandedClassName && isExpanded ? additionalItemsExpandedClassName : '',
        ]"
      >
        <template v-for="(child, index) in hiddenItems" :key="child.key || index + maxVisibleItems">
          <component :is="child" />
        </template>
      </div>

      <!-- Кнопка показать все/свернуть -->
      <button
        type="button"
        :class="buttonClassName || $style.toggleButton"
        @click="handleToggle"
      >
        <span :class="buttonClassName ? undefined : $style.toggleText">
          {{ isExpanded ? collapseText : showAllText }}
        </span>
        <svg
          :class="[
            buttonClassName ? $style.showAllIcon : $style.toggleIcon,
            {
              [$style.showAllIcon_expanded]: isExpanded && buttonClassName,
              [$style.toggleIcon_expanded]: isExpanded && !buttonClassName,
            },
          ]"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, defineEmits, defineProps, withDefaults, useCssModule, onMounted } from 'vue'

export interface ExpandableListProps {
  /* Максимальное количество видимых элементов */
  maxVisibleItems?: number
  /* Текст для кнопки "Показать все" */
  showAllText?: string
  /* Текст для кнопки "Свернуть" */
  collapseText?: string
  /* CSS класс для контейнера */
  className?: string
  /* CSS класс для дополнительных элементов */
  additionalItemsClassName?: string
  /* CSS класс для дополнительных элементов в expanded состоянии */
  additionalItemsExpandedClassName?: string
  /* CSS класс для кнопки */
  buttonClassName?: string
  /* Отключить анимации */
  disableAnimation?: boolean
  /* Колбэк при изменении состояния (развернуто/свернуто) */
  onToggle?: (isExpanded: boolean) => void
}

const props = withDefaults(defineProps<ExpandableListProps>(), {
  maxVisibleItems: 3,
  showAllText: 'Показать все',
  collapseText: 'Свернуть',
  disableAnimation: false,
})

const emit = defineEmits<{
  toggle: [isExpanded: boolean]
}>()

const style = useCssModule()
const slots = useSlots()
const isExpanded = ref(false)

const children = computed(() => {
  if (!slots.default) return []
  
  const slotContent = slots.default()
  
  // Если slotContent - это Fragment с детьми
  if (slotContent && 
      slotContent.type && 
      slotContent.children && 
      Array.isArray(slotContent.children)) {
    return slotContent.children
  }
  
  // Если slotContent - массив (может содержать несколько узлов или Fragment'ов)
  if (Array.isArray(slotContent)) {
    // Если в массиве один элемент и это Fragment
    if (slotContent.length === 1 && 
        slotContent[0] && 
        slotContent[0].children) {
      return slotContent[0].children
    }
    return slotContent
  }
  
  return [slotContent]
})

// Видимые элементы
const visibleItems = computed(() => 
  children.value.slice(0, props.maxVisibleItems)
)

// Скрытые элементы
const hiddenItems = computed(() => 
  children.value.slice(props.maxVisibleItems)
)

// Классы для контейнера
const containerClasses = computed(() => ({
  [props.className || '']: !!props.className,
  [style.container]: !props.className
}))

// Обработчик переключения
const handleToggle = () => {
  const newState = !isExpanded.value
  isExpanded.value = newState
  
  // Вызываем колбэк если передан
  if (props.onToggle) {
    props.onToggle(newState)
  }
  
  // Эмитим событие
  emit('toggle', newState)
}

onMounted(() => {
  console.log(children.legth)
})
</script>



<style module scoped>
    .container {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  /* Дополнительные элементы с анимацией */

  .additionalItems {
    max-height: 0;
    overflow: hidden; /* Возвращаем для корректной анимации */
    transform: translateY(-4px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .additionalItems_expanded {
    max-height: 600px;
    transform: translateY(0);
    opacity: 1;
  }

  /* Отключение анимации */

  .additionalItems_noAnimation {
    transition: none;
  }

  .additionalItems_noAnimation.additionalItems_expanded {
    max-height: none;
    transform: none;
    opacity: 1;
  }

  /* Кнопка показать все/свернуть */

  .toggleButton {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    margin-top: 8px;
    padding: 8px 12px;
    color: var(--accent-color, #007bff);
    font-weight: 400;
    font-size: 16px;
    font-family: "Roboto", var(--font-family, sans-serif);
    line-height: 1.5;
    letter-spacing: 0.02em;
    text-align: left;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }

  .toggleButton:hover {
    background-color: var(--button-hover-color, rgb(0 123 255 / 10%));
  }

  .toggleButton:focus-visible {
    outline: 2px solid var(--accent-color, #007bff);
    outline-offset: 2px;
  }

  .toggleButton:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }

  /* Текст кнопки */

  .toggleText {
    flex: 1;
    text-align: left;
  }

  /* Иконка стрелки с анимацией поворота */

  .toggleIcon {
    flex-shrink: 0;
    color: var(--accent-color, #007bff);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toggleIcon_expanded {
    transform: rotate(180deg);
  }

  /* Стили для иконки когда используется внешний buttonClassName */

  .showAllIcon {
    color: var(--accent-color, #007bff);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .showAllIcon_expanded {
    transform: rotate(180deg);
  }

  /* Responsive дизайн */

  @media (width <= 768px) {
    .toggleButton {
      height: 36px;
      padding: 6px 10px;
      font-size: 14px;
    }

    .additionalItems_expanded {
      max-height: 300px; /* Меньше для мобильных */
    }
  }

  /* Accessibility - уменьшение анимации для пользователей с ограниченными возможностями */

  @media (prefers-reduced-motion: reduce) {
    .additionalItems,
    .toggleIcon {
      transition: none;
    }

    .additionalItems_expanded {
      max-height: none;
      transform: none;
      opacity: 1;
    }

    .toggleIcon_expanded {
      transform: rotate(180deg);
      transition: none;
    }
  }
</style>