<script setup lang="ts">

import { withDefaults, defineProps} from 'vue';
    
    
    export interface CheckboxUIProps {
        label: string;
        isChecked?: boolean;
        onChange: (value: boolean) => void;  // Исправленный тип
        largeHeight?: boolean;
    }

  const props = withDefaults(
    defineProps<CheckboxUIProps>(),
    {
      isChecked: false,
      largeHeight: false
    })
    
    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        props.onChange(target.checked); // Передаём boolean
    };

</script>
    
<template>
      <label
        :for="label"
        :class="[
          $style.label,
          { [$style.label_large_height]: largeHeight }
        ]"
      >
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
      background-image: url("../assets/checkbox-empty.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      cursor: pointer;
    }
    
    .input:checked + .icon {
      background-image: url("../assets/checkbox-done.svg");
    }
</style>