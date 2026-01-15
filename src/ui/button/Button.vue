<script setup lang="ts">
import { computed, withDefaults, defineProps } from "vue";
import classNames from 'classnames';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  dataCy?: string;
}

// Определение props с дефолтными значениями
const props = withDefaults(defineProps<ButtonProps>(), {
  type: "button",
  secondary: false,
  tertiary: false,
  disabled: false,
});

// Вычисляемые классы для кнопки
const buttonClasses = computed(() => classNames(
  'button',
  props.className || "",
  props.secondary ? 'secondary' : "",
  props.tertiary ? 'tertiary' : ""
));
</script>

<template>
  <button
    :data-cy="dataCy"
    :type="type"
    :disabled="disabled"
    @click="onClick"
    :class="[
      $style.button,
      className,
      {
        [$style.secondary]: secondary,
        [$style.tertiary]: tertiary,
      }
    ]"
  >
    {{ label }}
    <slot />
  </button>
</template>
    
<style module scoped lang="css">
    
      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: max-content;
        height: 48px;
        padding: 16px 8px;
        color: var(--text-color);
        font-size: var(--font-size-h4);
        font-family: var(--font-family);
        background-color: var(--accent-color);
        border: none;
        border-radius: 16px;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
      }
      
      .button:hover {
        background-color: var(--button-hover-color);
      }
      
      .button:active {
        color: var(--surface-color);
        background-color: var(--button-pressed-color);
      }
      
      .button:disabled {
        color: var(--caption-color);
        background-color: var(--disabled-bg-color);
      }
      
      /* Вторичные кнопки */
      .button.secondary {
        background-color: var(--enterButton-color);
        border: solid 1px var(--accent-color);
      }
      
      .button.secondary:hover {
        color: var(--caption-color);
        border-color: var(--button-hover-color);
      }
      
      .button.secondary:active {
        color: var(--text-color);
        border-color: var(--button-pressed-color);
      }
      
      .button.secondary:disabled {
        color: var(--disabled-text-color);
        border-color: var(--disabled-bg-color);
      }
      
      /* Третичные кнопки */
      .button.tertiary {
        background-color: var(--accent-color);
        border: solid 1px transparent;
      }
      
      /* Адаптивные стили для разных экранов */
      @media (max-width: 900px) {
        /* Средние экраны */
        .button {
          font-size: var(--font-size-h5);
          height: 38px;
          border-radius: 12px;
          padding: 9px 5px;
        }
      
        .button.secondary {
          font-size: var(--font-size-h5);
          height: 38px;
          border-radius: 12px;
        }
      }
      
      @media (max-width: 624px) {
        /* Маленькие экраны */
        .button {
          font-size: 10px;
          height: 24px;
          border-radius: 7px;
          padding-block: 12px;
        }
      
        .button.secondary {
          font-size: 10px;
          height: 24px;
          border-radius: 7px;
          padding: 3px 1px;
        }
      }
</style>