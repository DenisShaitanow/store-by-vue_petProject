<script setup lang="ts">
  import { withDefaults, defineProps } from 'vue';

  export interface CheckboxUIProps {
    label: string;
    isChecked?: boolean;
    onChange: (checked: boolean, label: string) => void; // Исправленный тип
    largeHeight?: boolean;
  }

  const props = withDefaults(defineProps<CheckboxUIProps>(), {
    isChecked: false,
    largeHeight: false,
  });

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    props.onChange(target.checked, target.id); // Передаём boolean
  };
</script>

<template>
  <label :for="label" :class="[$style.label, { [$style.label_large_height]: largeHeight }]">
    <input
      :class="$style.input"
      type="checkbox"
      :checked="isChecked"
      @change="handleChange"
      :id="label"
    />
    <span :class="$style.icon"></span>
    <span :class="$style.text">{{ label }}</span>
  </label>
</template>

<style module>
  .label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }

  .label_large_height {
    height: 32px;
  }

  .text {
    width: fit-content;
    color: var(--text-color);
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family, sans-serif);
    line-height: 110%;
    white-space: wrap;
    text-align: left;
  }

  .input {
    display: none;
  }

  .icon {
    position: relative;
    display: flex;
    align-items: center;
    width: 24px;
    height: 24px;
    background-image: url('../assets/checkbox-empty.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;
  }

  .input:checked + .icon {
    background-image: url('../assets/checkbox-done.svg');
  }

  @media (890px <= width <= 1180px) {
    .container {
      gap: 12px;
    }

    .title {
      font-weight: var(--font-weight-h4);
      font-size: var(--font-size-h4);
      line-height: var(--line-height-h4);
    }

    .icon {
      width: 20px;
      height: 20px;
    }

    .text {
      font-size: 13px;
    }

    .label {
      gap: 5px;
    }

    .list {
      gap: 8px;
    }
  }

  @media (600px <= width <= 890px) {
    .container {
      gap: 9px;
    }

    .title {
      font-weight: var(--font-weight-h5);
      font-size: var(--font-size-h5);
      line-height: var(--line-height-h5);
    }

    .icon {
      width: 16px;
      height: 16px;
    }

    .text {
      font-size: 11px;
    }

    .label {
      gap: 3px;
    }

    .list {
      gap: 6px;
    }
  }

  @media (513px <= width <= 599px) {
    .container {
      gap: 7px;
    }

    .title {
      font-size: 9px;
      font-weight: 500;
      line-height: 110%;
    }

    .icon {
      width: 13px;
      height: 13px;
    }

    .text {
      font-size: 9px;
    }

    .label {
      gap: 2px;
    }

    .list {
      gap: 4px;
    }
  }

  @media (width <= 512px) {
    .container {
      gap: 5px;
    }

    .title {
      font-size: 9px;
      font-weight: 500;
      line-height: 110%;
    }

    .icon {
      width: 8px;
      height: 8px;
    }

    .text {
      font-size: 7px;
    }

    .label {
      gap: 2px;
    }

    .list {
      gap: 4px;
    }
  }
</style>
