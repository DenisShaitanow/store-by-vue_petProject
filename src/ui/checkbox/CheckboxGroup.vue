<script setup lang="ts">
    import { withDefaults, defineProps } from 'vue';
    import CheckboxUI from './CheckboxUI.vue';
    
    export interface CheckboxGroupUIProps {
      title?: string;
      fieldNames: string[];
      selectedItems?: string[];
      onChange: (e: boolean) => void;
      largeHeight?: boolean;
      withInDropdown?: boolean;
    }

    const props = withDefaults(
    defineProps<CheckboxGroupUIProps>(),
    {
      title: '',
      isChecked: false,
      largeHeight: false,
      withInDropdown: false,
      selectedItems: () => []
    })
    
    
</script>
    
<template>
      <div :class="$style.container">
        <p v-if="title" :class="$style.title">{{ title }}</p>
        <div
          :class="[
            $style.list,
            { [$style.list_with_dropdown]: withInDropdown }
          ]"
        >
          <CheckboxUI
            v-for="label in fieldNames"
            :key="label"
            :label="label"
            :is-checked="selectedItems.includes(label)"
            @change="onChange"
            :large-height="largeHeight || withInDropdown"
          />
        </div>
      </div>
</template>
    
<style module scoped>
      .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        height: fit-content;
      }
      
      .title {
        font-weight: var(--font-weight-h3);
        font-size: var(--font-size-h3);
        font-family: var(--second-family);
        line-height: var(--line-height-h3);
        color: var(--text-color);
      }
      
      .list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 12px;
        height: fit-content;
      }
      
      .list_with_dropdown {
        gap: 4px;
        padding-left: 12px;
      }
      
      
      @media (890px <= width <= 1180px) {
        .container { gap: 12px; }
        .title {
          font-weight: var(--font-weight-h4);
          font-size: var(--font-size-h4);
          line-height: var(--line-height-h4);
        }
        .icon { width: 20px; height: 20px; }
        .text { font-size: 13px; }
        .label { gap: 5px; }
        .list { gap: 8px; }
      }
      
      @media (600px <= width <= 890px) {
        .container { gap: 9px; }
        .title {
          font-weight: var(--font-weight-h5);
          font-size: var(--font-size-h5);
          line-height: var(--line-height-h5);
        }
        .icon { width: 16px; height: 16px; }
        .text { font-size: 11px; }
        .label { gap: 3px; }
        .list { gap: 6px; }
      }
      
      @media (513px <= width <= 599px) {
        .container { gap: 7px; }
        .title { font-size: 9px; font-weight: 500; line-height: 110%; }
        .icon { width: 13px; height: 13px; }
        .text { font-size: 9px; }
        .label { gap: 2px; }
        .list { gap: 4px; }
      }
      
      @media (width <= 512px) {
        .container { gap: 5px; }
        .title { font-size: 9px; font-weight: 500; line-height: 110%; }
        .icon { width: 8px; height: 8px; }
        .text { font-size: 7px; }
        .label { gap: 2px; }
        .list { gap: 4px; }
      }
</style>