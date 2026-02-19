<template>
  <div :class="$style.stepper">
    <div :class="$style.stepperText">Шаг {{ currentStep }} из {{ overallSteps }}</div>
    <div :class="$style.stepperBars">
      <div
        v-for="step in stepsArray"
        :key="step"
        :class="[$style.stepperBar, step <= currentStep ? $style.active : $style.inactive]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineProps } from 'vue';

  interface StepperProps {
    currentStep: number;
    overallSteps: number;
  }

  const props = defineProps<StepperProps>();

  const stepsArray = computed(() => {
    return Array.from({ length: props.overallSteps }, (_, i) => i + 1);
  });
</script>

<style module scoped>
  .stepper {
    width: 90%;
    text-align: center;
    padding-inline: 8px;
    padding-block: 8px;
  }

  .stepperText {
    margin-bottom: 12px;
    color: var(--text-color);
    font-weight: 500;
    font-size: 24px;
    font-family: var(--second-family), serif;
    line-height: 1.2;
  }

  .stepperBars {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .stepperBar {
    width: 60px;
    height: 4px;
    background-color: var(--accent-color);
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .active {
    background-color: var(--accent-color);
  }

  .inactive {
    background-color: var(--disabled-bg-color);
  }

  @media (width <= 500px) {
    .stepperText {
      font-size: 18px;
    }

    .stepperBar {
      width: 43px;
    }
  }
</style>
