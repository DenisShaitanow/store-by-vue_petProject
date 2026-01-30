

<template>
    <div :class="$style.container">
      <div :class="$style.icon">
        <svg
          :class="$style.svg"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect :class="$style.bg" width="40" height="40" rx="20" />
          <path
            :class="$style.symbol"
            d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z"
          />
        </svg>
      </div>
      <p :class="$style.text">
        Добро пожаловать в интернет магазин StoreThings. Здесь вы можете выбрать
        для себя подходящий наряд или подыскать подарок близкому человеку. В
        магазине представлено множество стильных и классных вещей, который не
        оставят равнодушным даже самых притязательных покупателей.
      </p>
      <ButtonUI
        label="Вернуться к покупкам"
        :class="$style.button"
        :onClick="handleClick"
      />
    </div>
</template>

<script setup lang="ts">

    import { useRouter } from 'vue-router';
    import ButtonUI from '../../ui/button/Button.vue';

    const router = useRouter()
    
    const handleClick = () => {
        router.back()
    };


</script>

<style module scoped>
    .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    margin: auto;
    inline-size: 75%;
    background-color: rgba(
        var(--accent-color-r),
        var(--accent-color-g),
        var(--accent-color-b),
        0.2
    );
    block-size: fit-content;
    padding: 50px;
    border-radius: 50px;
    }

    .svg {
    width: 100px;
    height: 100px;
    }

    .bg {
    fill: var(--accent-color);
    }

    .symbol {
    fill: var(--background-page-color);
    }

    .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    inline-size: fit-content;
    block-size: fit-content;
    margin-top: 10px;
    }

    .text {
    display: block;
    inline-size: fit-content;
    block-size: fit-content;
    padding-block: 50px;
    padding-inline: 80px;
    color: var(--text-color);
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family-logo);
    line-height: var(--line-height-body);
    text-align: justify;
    text-indent: 1em;
    }

    .button {
    padding: 16px 13px !important;
    }

    @media (701px <= width < 950px) {
    .svg {
        width: 50px;
        height: 50px;
    }

    .text {
        font-size: 14px;
        padding-block: 20px;
        padding-inline: 25px;
    }
    }

    @media (536px <= width <= 700px) {
    .container {
        inline-size: 75%;
        padding: 30px;
    }

    .svg {
        width: 36px;
        height: 36px;
    }

    .text {
        font-size: 13px;
        padding-block: 15px;
        padding-inline: 18px;
    }
    }

    @media (width <= 535px) {
    .container {
        inline-size: 75%;
        padding: 15px;
    }

    .svg {
        width: 26px;
        height: 26px;
    }

    .text {
        font-size: 11px;
        padding-block: 12px;
        padding-inline: 14px;
    }

    .button {
        padding: 8px 6px !important;
    }
    }
</style>
