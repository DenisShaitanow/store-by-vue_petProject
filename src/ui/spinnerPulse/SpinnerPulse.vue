<template>
  <svg
    :class="[$style.preloader, className]"
    width="40"
    height="40"
    viewBox="22 22 44 44"
    id="root-preloader"
  >
    <g :class="$style['g-container']">
      <circle
        cx="44"
        cy="44"
        r="20.2"
        fill="none"
        stroke-width="3.6"
        stroke="var(--color-primary, #abd27a)"
        :class="$style.circle"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
  import { withDefaults, defineProps } from 'vue';
  interface Props {
    className?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    className: '',
  });
</script>

<style module scoped>
  .preloader {
    position: fixed;
    left: calc(50% - 20px);
    top: calc(50% - 20px);
    transition: opacity 300ms linear;
  }

  .circle {
    animation: dash 1.4s ease-in-out infinite;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0px;
  }

  .g-container {
    transform-box: fill-box;
    transform-origin: center;
    animation: rotate 1.4s linear infinite;
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1px, 200px;
      stroke-dashoffset: 0px;
    }
    50% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -15px;
    }
    100% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -125px;
    }
  }

  @keyframes rotate {
    0% {
      transform-origin: 50% 50%;
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
