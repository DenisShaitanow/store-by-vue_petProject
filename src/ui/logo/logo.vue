<template>
  <div :class="$style.wrapper">
    <div :class="$style.icon">
      <svg :class="$style.svg" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect :class="$style.bg" width="40" height="40" rx="20" />
        <path
          :class="$style.symbol"
          d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z"
        />
      </svg>
    </div>
    <span :class="$style.text">StoreThings</span>
  </div>
</template>

<script setup lang="ts"></script>

<style module scoped>
  .wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: fit-content;
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .svg {
    width: 40px;
    height: 40px;
  }

  .bg {
    fill: var(--accent-color);
  }

  .symbol {
    fill: var(--background-page-color);
  }

  .text {
    color: var(--text-color);
    font-weight: var(--font-weight-logo);
    font-size: var(--font-size-logo);
    font-family: var(--font-family-logo);
    line-height: var(--line-height-logo);
    letter-spacing: -0.02em;
  }

  @media (min-width: 769px) and (max-width: 900px) {
    .wrapper {
      width: 100px;
      gap: 8px;
    }

    .text {
      font-size: 18px;
    }

    .svg {
      width: 22px;
      height: 22px;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .wrapper {
      gap: 5px;
    }

    .text {
      font-size: 16px;
    }

    .svg {
      width: 19px;
      height: 19px;
    }
  }

  @media (min-width: 321px) and (max-width: 480px) {
    .wrapper {
      gap: 3px;
    }

    .text {
      font-size: 13px;
    }

    .svg {
      width: 14px;
      height: 14px;
    }
  }

  @media (max-width: 321px) {
    .wrapper {
      gap: 3px;
    }

    .text {
      font-size: 12px;
    }

    .svg {
      width: 14px;
      height: 14px;
    }
  }
</style>
