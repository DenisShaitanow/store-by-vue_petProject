

<script setup lang="ts">
  
    import { ref, computed, watch } from 'vue'
    import VDatePicker from 'vue-date-picker/src/datepicker.vue';


    
    
    interface Props {
      inline?: boolean
      id?: string
      className?: string
      modelValue?: Date | null
      onChange?: (date: Date | null) => void
    }
    
    // Инициализация состояний
    const props = withDefaults(defineProps<Props>(), {
      inline: true,
      modelValue: null,
    })
    
    const emit = defineEmits(['update:modelValue'])
    
    // Внутреннее отслеживаемое значение
    const localValue = ref(props.modelValue)
    
    // Двухсторонняя связь через v-model
    watch(
      () => props.modelValue,
      (newVal) => {
        localValue.value = newVal
      },
    )
    
    // Обработка изменения даты
    const handleChange = (date: Date | null) => {
      emit('update:modelValue', date)
      props.onChange?.(date)
    }
    
    // Вспомогательные классы
    const containerClasses = computed(() => {
      return ['calendar-container', props.className || '']
    })
    
</script>
    
<template>
      <div  :id="props.id">
        <VDatePicker
          v-model="localValue"
          :inline="props.inline"
          @update:model-value="handleChange"
          teleport="body"
          :is24hr="true"
          color="#4CAF50"
        />
      </div>
</template>
    
<style scoped lang="scss">
    .calendar-container {
      box-sizing: border-box;
      width: 280px;
      height: 360px;
      color: var(--calendar-text);
      font-family: var(--calendar-font);
      border: 1px solid var(--calendar-border);
      border-radius: var(--calendar-radius);
    }
    
    .calendar-container .vp-calendar {
      position: relative;
      box-sizing: border-box;
      width: 280px;
      height: 360px;
      padding: 16px;
      overflow: hidden;
      background: var(--calendar-bg);
      border: 1px solid var(--calendar-border);
      border-radius: var(--calendar-radius);
    }
    
    /* Заголовок календаря */
    .calendar-container .vp-popup__header {
      width: 100%;
      height: 56px;
      padding: 0;
      background: transparent;
      border: 0;
      box-shadow: none;
    }
    
    .calendar-container .vp-button-group {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      width: 215px;
      height: 40px;
      margin: 16px 32px 0;
      padding: 8px 0;
    }
    
    .calendar-container .vp-button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px;
      color: var(--calendar-text);
      font: inherit;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    
    .calendar-container .vp-button:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
    
    .calendar-container .vp-days {
      display: grid;
      grid-template-rows: repeat(6, var(--calendar-day-size));
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      padding: 0 8px;
      overflow: hidden;
      place-items: start center;
    }
    
    .calendar-container .vp-weekdays {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 28px;
    }
    
    .calendar-container .vp-day {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: var(--calendar-day-size);
      height: var(--calendar-day-size);
      color: var(--calendar-text);
      font-size: 12px;
      border-radius: 50%;
      cursor: pointer;
      transition:
        background 140ms ease,
        color 140ms ease;
    }
    
    .calendar-container .vp-day:hover {
      font-weight: inherit;
      background: var(--accent-color);
    }
    
    .calendar-container .vp-day:active {
      font-weight: inherit;
      background: var(--accent-color);
    }
    
    .calendar-container .vp-day--selected {
      color: var(--calendar-text);
      font-weight: inherit;
      background: var(--button-pressed-color);
      box-shadow: none;
    }
    
    .calendar-container .vp-day--today {
      box-shadow: inset 0 0 0 1px rgb(0 0 0 / 30%);
    }
    
    .calendar-container .vp-day--outside {
      color: var(--calendar-muted);
      background: transparent;
      opacity: 0.6;
      pointer-events: none;
    }
    
    .calendar-container .vp-dialog__actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
    }
    
    .calendar-container .vp-button--cancel {
      color: var(--calendar-text);
      background: transparent;
      border: 1px solid var(--calendar-accent);
    }
    
    .calendar-container .vp-button--confirm {
      color: var(--calendar-text);
      background: transparent;
      border: 1px solid var(--calendar-accent);
    }
    
    .calendar-container .vp-button--cancel:hover,
    .calendar-container .vp-button--cancel:active,
    .calendar-container .vp-button--confirm:hover,
    .calendar-container .vp-button--confirm:active {
      width: calc(var(--btn-width) - 10px);
      color: var(--calendar-text);
      background: var(--calendar-accent);
      border-color: var(--calendar-accent);
    }
    
    .calendar-container .vp-popup {
      z-index: 50;
    }
    
    .calendar-container span[aria-hidden="true"] {
      text-transform: capitalize;
    }
    
    .calendar-container .vp-days [role="gridcell"]:nth-of-type(n + 43),
    .calendar-container .vp-day:nth-of-type(n + 43) {
      display: none;
    }
    
    /* Скрываем лишние элементы от самой библиотеки */
    .calendar-container .vp-popup__toolbar,
    .calendar-container .vp-popup__controls,
    .calendar-container .vp-popup__arrow {
      display: none !important;
      visibility: hidden !important;
    }
</style>