<template>
  <div :class="$style.container">
    <template v-if="productsInBasket.length > 0">
      <div :class="$style.cardList">
        <ProductCardInBasket
          v-for="card in productsInBasket"
          :key="card.item.id"
          :product="card.item"
          :count="card.count"
        />
      </div>
      <ButtonUI
        data-cy="proceedToCheckoutOrder"
        :class="$style.buttonBasket"
        label="Перейти к оформлению"
        @click="handleOrder"
      />
    </template>
    
    <div v-else :class="$style.noProducts">
      <SadSmile />
      <span :class="$style.basketEmpty">Корзина пуста.</span>
      <ButtonUI
        label="Вернуться к покупкам"
        @click="handleBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTypedStore } from '../../store/index';
import ButtonUI from '../../ui/button/Button.vue';
import ProductCardInBasket from '../../ui/productCardinBasket/ProductCardinBasket.vue';
import SadSmile from '../../ui/assets/smiley-sad-fill.svg?component'; // Проверьте импорт SVG

// Router
const router = useRouter();

// Store
const store = useTypedStore()

// Селектор (геттер) для товаров в корзине
const productsInBasket = computed(() => 
  store.getters['userData/selectBasket'] || []
);

// Обработчики
const handleOrder = () => {
  router.push('/formOrder');
};

const handleBack = () => {
  router.push('/');
};

 onMounted(() => {
        console.log(productsInBasket.value)  
    })
</script>

<style module scoped lang="css">

    .container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-self: center;
    margin: auto;
    inline-size: 55%;
    min-inline-size: 283px;
    block-size: fit-content;
    padding: 20px;
    background-color: rgba(
        var(--accent-color-r),
        var(--accent-color-g),
        var(--accent-color-b),
        0.2
    );
    border-radius: 40px;
    box-shadow: 0 0 3px var(--accent-color);
    gap: 15px;
    font-family: var(--second-family);
    color: var(--text-color);
    }

    .cardList {
    display: flex;
    align-self: center;
    inline-size: 90%;
    flex-direction: column;
    gap: 15px;
    }

    .image {
    display: block;
    inline-size: 100%;
    block-size: 400px;
    object-fit: cover;
    border-radius: 20px;
    }

    .information {
    display: flex;
    flex-direction: column;
    gap: 15px;
    inline-size: 60%;
    block-size: 100%;
    }

    .title {
    display: block;
    padding-inline: 10px;
    padding-block: 3px;
    font-size: 30px;
    font-weight: 650;
    line-height: 120%;
    max-inline-size: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important; /* Важно установить именно webkit-box */
    -webkit-line-clamp: 2; /* Обязательно с дефисом и префиксом */
    -webkit-box-orient: vertical; /* Ориентация вертикальной коробки */
    }

    .description {
    display: block;
    padding-inline: 10px;
    padding-block: 3px;
    font-size: 20px;
    font-weight: 300;
    line-height: 120%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important; /* Важно установить именно webkit-box */
    -webkit-line-clamp: 7; /* Обязательно с дефисом и префиксом */
    -webkit-box-orient: vertical; /* Ориентация вертикальной коробки */
    }

    .price {
    display: block;
    padding-inline: 10px;
    padding-block: 3px;
    font-size: 30px;
    font-weight: 650;
    line-height: 120%;
    color: brown;
    margin-bottom: 20px;
    }

    .buttonBasket {
    inline-size: 40% !important;
    align-self: center;
    }

    .noProducts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    min-block-size: 400px;
    }

    .basketEmpty {
    font-size: 30px;
    font-weight: 650;
    line-height: 120%;
    }

    @media (800px <= width <= 1200px) {
    .container {
        inline-size: 65%;
        border-radius: 36px;
    }
    }

    @media (600px <= width <= 799px) {
    .container {
        inline-size: 75%;
        border-radius: 32px;
    }
    }

    @media (400px <= width <= 599px) {
    .container {
        inline-size: 75%;
        border-radius: 27px;
    }

    .noProducts {
        min-block-size: 250px;
    }
    }

    @media (width <= 399px) {
    .container {
        inline-size: 85%;
        border-radius: 27px;
    }

    .noProducts {
        min-block-size: 190px;
    }
    }

</style>