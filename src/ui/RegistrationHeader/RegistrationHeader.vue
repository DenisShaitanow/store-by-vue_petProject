<template>
  <div :class="$style.header">
    <Logo />
    <ButtonUI :class="$style.closeButton" @click="props.onClose" label="Закрыть" tertiary>
      <img :src="CrossSvg" alt="Закрыть" />
    </ButtonUI>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import CrossSvg from '../assets/cross.svg?url';
  import ButtonUI from '../button/Button.vue';
  import Logo from '../logo/logo.vue';

  interface Props {
    onClose: () => void;
  }

  const props = defineProps<Props>();
</script>

<style module scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    max-width: 1440px;
    min-width: 293px;
    padding-block: 21px 20px;
    padding-inline: 40px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background-color: rgba(
      var(--accent-color-r),
      var(--accent-color-g),
      var(--accent-color-b),
      0.2
    );
  }

  .closeButton {
    gap: 8px;
    width: 147px;
  }

  @media (601px <= width <= 800px) {
    .closeButton {
      gap: 8px;
      width: 147px;
      height: 36px !important;
      border-radius: 12px !important;
      font-size: 13px !important;
      padding: 12px 8px !important;
    }

    .header {
      padding-block: 16px 15px;
    }
  }

  @media (width <= 600px) {
    .closeButton {
      gap: 5px;
      height: 28px !important;
      width: 94px;
      border-radius: 8px !important;
      font-size: 11px !important;
      padding: 8px 4px !important;
    }

    .header {
      padding-block: 16px 15px;
    }
  }
</style>
