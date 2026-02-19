<template>
  <div :class="$style.container">
    <span :class="$style.text">
      Ваш заказ успешно создан и поступил в обработку, его номер {{ orderId }}.
    </span>
    <ButtonUI
      data-cy="returnToMainPageAfterOrder"
      :class="$style.buttonOk"
      @click="handleOk"
      label="Отлично"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTypedStore } from '../../store/index';
  import ButtonUI from '../../ui/button/Button.vue';

  // Router
  const router = useRouter();

  // Store
  const store = useTypedStore();

  // Селекторы
  const orders = computed(() => store.getters['userData/selectOrders'] || []);
  const orderId = computed(() => {
    const ordersArray = orders.value;
    return ordersArray[ordersArray.length - 1];
  });

  // Обработчики
  const handleOk = () => {
    router.push('/');
  };
</script>

<style module scoped lang="css">
  .container {
    display: flex;
    flex-direction: column;
    inline-size: 75%;
    max-inline-size: 700px;
    margin-inline: auto;
    background-color: rgba(
      var(--accent-color-r),
      var(--accent-color-g),
      var(--accent-color-b),
      0.2
    );
    padding: 30px;
    gap: 10px;
    border-radius: 10px;
  }

  .text {
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-h2);
    line-height: var(--line-height-h2);
    color: var(--text-color);
    text-align: center;
  }

  .buttonOk {
    width: 40%;
    align-self: center;
    margin-top: 15px;
  }

  @media (601px <= width <= 1000px) {
    .text {
      font-size: var(--font-size-h4);
      font-weight: var(--font-weight-h4);
      line-height: var(--line-height-h4);
    }
  }

  @media (width <= 600px) {
    .text {
      font-size: var(--font-size-h5);
      font-weight: var(--font-weight-h5);
      line-height: var(--line-height-h5);
    }
  }
</style>
