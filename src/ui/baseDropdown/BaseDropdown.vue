

<script lang="ts">
    import { defineComponent, computed, ref, nextTick, watch, withDefaults, defineProps } from 'vue';
    import classNames from 'classnames';
    import $style from './BaseDropdown.vue?module'; // Путь к вашему файлу
    
    type PlacementType = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    
    interface DropdownContent {
      content: any;
}

const props = withDefaults(defineProps<{
  trigger: any;                   // Требуется триггер любого типа
  children: DropdownContent[];    // Обязательное массив детей
  isOpen?: boolean;               // Может отсутствовать
  onToggle?: (isOpen: boolean) => void; // Колбэк
  placement?: PlacementType;      // Вариант расположения
  offset?: number;                // Число смещения
  closeOnClickOutside?: boolean;  // Логическое значение закрытия вне
  closeOnEscape?: boolean;        // Логическое значение закрытия ESC
  disabled?: boolean;             // Логический признак блокировки
  className?: string;             // Строка класса контейнера
  dropdownClassName?: string;     // Строка класса выпадающего блока
  ariaLabel?: string;             // Строковая метка доступности
}>(), {
  placement: 'bottom-left',       // Дефолтное размещение снизу слева
  offset: 4,                     // Дефолтное смещение 4px
  closeOnClickOutside: true,      // По умолчанию закрывается при клике вне
  closeOnEscape: true,            // По умолчанию закрывается по ESC
  disabled: false,                // Изначально не отключено
  isOpen: false,                 // Изначально закрыто
});



export default defineComponent({
  name: 'BaseDropdown',
      setup(props: {
      trigger: any;                   // Требуется триггер любого типа
      children: DropdownContent[];    // Обязательное массив детей
      isOpen?: boolean;               // Может отсутствовать
      onToggle?: (isOpen: boolean) => void; // Колбэк
      placement?: PlacementType;      // Вариант расположения
      offset?: number;                // Число смещения
      closeOnClickOutside?: boolean;  // Логическое значение закрытия вне
      closeOnEscape?: boolean;        // Логическое значение закрытия ESC
      disabled?: boolean;             // Логический признак блокировки
      className?: string;             // Строка класса контейнера
      dropdownClassName?: string;     // Строка класса выпадающего блока
      ariaLabel?: string;             // Строковая метка доступности
    }
) {
    const internalIsOpen = ref(false);                
    const isOpen = computed<boolean>(() => props.isOpen ?? internalIsOpen.value); 
    
        const containerRef = ref<HTMLDivElement | null>(null);
        const dropdownRef = ref<HTMLDivElement | null>(null);
    
        function toggle(isOpen: boolean) {
          if (props.disabled) return;
          if (props.onToggle) {
            props.onToggle(isOpen);
          } else {
            internalIsOpen.value = isOpen;
          }
        }
    
        async function handleTriggerClick() {
          await nextTick(); // wait for DOM update before toggling
          toggle(!isOpen.value);
        }
    
        function handleTriggerKeyDown(e: KeyboardEvent) {
          if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            toggle(!isOpen.value);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            toggle(false);
          }
        }
    
    
        function focusFirstFocusableElement() {
          if (isOpen.value && dropdownRef.value) {
            const focusableElements = [
              'button',
              '[href]',
              'input',
              'select',
              'textarea',
              `[tabindex]:not([tabindex="-1"])`
            ];
            const el: HTMLDivElement | null = dropdownRef?.value.querySelector(focusableElements.join(', '));
            el?.focus();
          }
        }
    
        const containerClasses = computed(() =>
            classNames($style.container, {
                [$style.disabled]: props.disabled,
            }, props.className)
        );

        const dropdownClasses = computed(() =>
            classNames($style.dropdown, $style[`placement-${props.placement}`], {
                [$style.open]: isOpen.value,
            }, props.dropdownClassName)
        );

        const dropdownStyles = computed(() => ({
            '--dropdown-offset': `${props.offset}px`,
        }));

        const placement = props.placement;
    
        return {
          isOpen,
          containerRef,
          dropdownRef,
          handleTriggerClick,
          handleTriggerKeyDown,
          containerClasses,
          dropdownClasses,
          dropdownStyles,
          focusFirstFocusableElement,
          placement
        };
      },
    });
</script>
    
<template>
    <div :class="$style.wrapper">
      <!-- Тригер -->
      <div
        :class="$style.trigger"
        @click="handleTriggerClick"
        @keydown="handleTriggerKeyDown"
        :tabindex="disabled ? '-1' : '0'"
        role="button"
        :aria-haspopup="true"
        :aria-expanded="isOpen"
        :aria-label="ariaLabel"
        data-testid="base-dropdown-trigger"
      >
        {{ trigger }}
      </div>
  
      <!-- Сам выпадающий список -->
      <div
        v-show="isOpen"
        :class="[
          $style.dropdown,
          $style[`placement-${placement}`]
        ]"
        :style="dropdownStyles"
        role="menu"
        :aria-hidden="!isOpen"
        data-testid="base-dropdown-content"
      >
        <div :class="$style.content">
          {{ children }}
        </div>
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