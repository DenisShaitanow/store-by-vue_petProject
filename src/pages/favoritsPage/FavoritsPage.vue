<template>
  <div :class="$style.rowContainer">
    <div :class="$style.containerFixed">
      <div :class="$style.filters">
        <div>
          <CheckboxGroupUI
            :selected-items="selectedSexData"
            title="Пол"
            :selected-values="selectedSex"
            :field-names="['Для женщин', 'Для мужчин']"
            @update:checkbox="handleSex"
          />
        </div>
        <div>
          <CheckboxDropdown
            :selected-values="selectedCategoriesData"
            @update:values="handleCategories"
            title="Категория"
            staticMode
            :options="[
              'Рубашки',
              'Обувь',
              'Верхняя одежда',
              'Нижнее белье',
              'Головные уборы',
              'Брюки',
              'Аксессуары',
            ]"
          />
        </div>
      </div>
    </div>
    <span :class="$style.greyLine"></span>
    <div :class="$style.products" ref="productsContainerRef">
      <SpinnerPulse v-if="isLoading" :class="$style.spinner" />
      <template v-else>
        <template v-if="noProducts === true">
          <div ref="productCardRef" v-if="productsToShow[0]">
            <ProductCard
              :class="$style.product"
              :key="productsToShow[0].id"
              :title="productsToShow[0].title"
              :description="productsToShow[0].description"
              :short-description="productsToShow[0].shortDescription"
              :price="productsToShow[0].price"
              :id="productsToShow[0].id"
              :image="productsToShow[0].image"
              :category="productsToShow[0].category"
              :sex="productsToShow[0].sex"
              :is-liked="productsToShow[0].isLiked"
            />
          </div>

          <!-- Остальные карточки без рефов -->
          <ProductCard
            v-for="product in productsToShow.slice(1)"
            :key="product.id"
            :class="$style.product"
            :title="product.title"
            :description="product.description"
            :short-description="product.shortDescription"
            :price="product.price"
            :id="product.id"
            :image="product.image"
            :category="product.category"
            :sex="product.sex"
            :is-liked="product.isLiked"
          />
        </template>
        <template v-else>
          <div :class="$style.noProductsContainer">
            <span :class="$style.noProducts">
              Вы пока еще не выбрали понравившиеся товары. Но вы можете сделать это прямо сейчас!
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              :class="$style.noProductsSVG"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6.09 14.999c-.38934-.88-.59031-1.8317-.59-2.794 0-3.70501 2.91-6.70601 6.5-6.70601s6.5 3.002 6.5 6.70601c.0003.9623-.2007 1.914-.59 2.794M12 1.99899v1M22 11.999h-1m-18 0H2m17.07-7.07101-.707.707m-12.726.001-.707-.707M14.517 19.306c1.01-.327 1.416-1.252 1.53-2.182.034-.278-.195-.509-.475-.509H8.477c-.06838-.0011-.1362.0123-.199.0394-.06279.0271-.11912.0672-.16525.1177-.04613.0505-.08102.1102-.10235.1752-.02134.0649-.02863.1337-.0214.2017.112.928.394 1.606 1.464 2.156m5.064.001-5.064-.001m5.064.001c-.121 1.945-.683 2.715-2.51 2.693-1.954.036-2.404-.917-2.554-2.694"
              />
            </svg>
          </div>
        </template>
      </template>
    </div>
  </div>
  <div v-if="isLoadingMore" :class="$style.spinnerContainer">
    <SpinnerPulse :class="$style.spinnerLoadCards" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import { useStore } from 'vuex';
  import ProductCard from '../../ui/productCard/ProductCard.vue';
  import CheckboxGroupUI from '../../ui/checkbox/CheckboxGroup.vue';
  import CheckboxDropdown from '../../ui/checkboxDropdown/CheckboxDropdown.vue';
  import SpinnerPulse from '../../ui/spinnerPulse/SpinnerPulse.vue';
  import type { IProduct } from '../../ui/productCard/ProductCard.vue';
  import { useTypedStore } from '../../store/index';

  // Константы
  const categoryMapping: Record<string, string> = {
    Рубашки: 't-shirts',
    Обувь: 'shoes',
    'Верхняя одежда': 'jackets',
    'Нижнее белье': 'underwear',
    'Головные уборы': 'hats',
    Брюки: 'trousers',
    Аксессуары: 'accessories',
  };

  const sexMapping: Record<string, string> = {
    'Для мужчин': 'man',
    'Для женщин': 'woman',
  };

  // Рефы
  const productsContainerRef = ref<HTMLDivElement>();
  const productCardRef = ref<HTMLDivElement>();

  // Состояния
  const isLoading = ref(false);
  const productsToShow = ref<IProduct[]>([]);
  const isLoadingMore = ref(false);
  const selectedSex = ref<string[]>([]);
  const selectedSexData = ref<string[]>([]);
  const selectedCategories = ref<(string | number)[]>([]);
  const selectedCategoriesData = ref<(string | number)[]>([]);

  // Добавляем таймер для дебаунсинга
  let scrollTimeout: NodeJS.Timeout | null = null;

  watch(
    () => productsToShow.value.length,
    async () => {
      if (productsToShow.value.length < 2) {
        await nextTick();
        if (productCardRef.value) {
          updateProductsToShow();
        }
      }
    },
    { immediate: true }
  );

  const products = computed(() => store.getters['userData/selectFavoriteProducts'] || []);

  // Store
  const store = useTypedStore();

  /*const products = ref<IProduct[]>([]);*/

  const selectProducts = computed(() => store.getters['userData/selectFavoriteProducts'] || []);

  const selectLoadingProducts = computed(
    () => store.getters['userData/selectLoadingProducts'] || false
  );

  const noProducts = computed(() => {
    return products.value.length > 0;
  });

  watch(selectLoadingProducts, (newValue: boolean) => {
    isLoading.value = newValue;
  });

  const filteredProducts = computed<IProduct[]>(() => {
    return products.value.filter((product) => {
      // Проверяем выбор категории
      if (
        selectedCategories.value.length > 0 &&
        !selectedCategories.value.includes(product.category)
      ) {
        return false;
      }
      // Проверяем выбор пола
      if (selectedSex.value.length > 0 && !selectedSex.value.includes(product.sex)) {
        return false;
      }
      return true;
    });
  });

  // Методы
  const calculateVisibleProductsCount = (width: number) => {
    if (!productCardRef.value) return 1;
    const productCardWidth = productCardRef.value.clientWidth;
    const cardsPerRow = Math.floor((width - 0.1 * width) / (productCardWidth || 160));
    return cardsPerRow * 6;
  };

  const updateProductsToShow = () => {
    if (productsContainerRef.value) {
      const containerWidth = productsContainerRef.value.clientWidth;
      const visibleCardsCount = calculateVisibleProductsCount(containerWidth);
      productsToShow.value = filteredProducts.value.slice(0, visibleCardsCount);
    }
  };

  const handleResize = () => {
    if (productsContainerRef.value) {
      const currentWidth = productsContainerRef.value.clientWidth;
      const newVisibleCount = calculateVisibleProductsCount(currentWidth);
      productsToShow.value = filteredProducts.value.slice(0, newVisibleCount);
    }
  };

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  const handleScroll = () => {
    // Дебаунсинг
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      const bottomReached =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - 50;

      if (
        bottomReached &&
        !isLoadingMore.value &&
        productsToShow.value.length < products.value.length
      ) {
        isLoadingMore.value = true;
        console.log('Loading started...');

        const nextBatchSize = calculateVisibleProductsCount(
          productsContainerRef.value?.clientWidth || 1200
        );
        const startIndex = productsToShow.value.length;
        const endIndex = Math.min(startIndex + nextBatchSize, products.value.length);
        console.log('Loading:', startIndex, 'to', endIndex);

        // Имитация асинхронной загрузки с задержкой
        setTimeout(() => {
          // 3. Добавляем новые товары
          productsToShow.value = [
            ...productsToShow.value,
            ...filteredProducts.value.slice(startIndex, endIndex),
          ];

          // 4. Ждем отрисовки DOM и скрываем спиннер
          nextTick();
          isLoadingMore.value = false;
          console.log('Loading complete. Total:', productsToShow.value.length);
        }, 1000); // Задержка для имитации загрузки
      }
    }, 150); // Задержка для дебаунсинга
  };

  const handleSex = (arg: { newValue: boolean; label: string }) => {
    const { newValue, label } = arg;

    const selectedItemData: string = sexMapping[label];

    if (!newValue) {
      selectedSexData.value = selectedSexData.value.filter((item) => item !== label);
      selectedSex.value = selectedSex.value.filter((item) => item !== selectedItemData);
    } else {
      selectedSex.value = [...selectedSex.value, selectedItemData];
      selectedSexData.value = [...selectedSexData.value, label];
    }
  };

  const handleCategories = (arg: { newValue: boolean; label: string }) => {
    const { newValue, label } = arg;

    const selectedItemdata: string = categoryMapping[label];

    if (!newValue) {
      selectedCategoriesData;
      selectedCategories.value = selectedCategories.value.filter(
        (item) => item !== selectedItemdata
      );
      selectedCategoriesData.value = selectedCategoriesData.value.filter((item) => item !== label);
    } else {
      selectedCategories.value = [...selectedCategories.value, selectedItemdata];
      selectedCategoriesData.value = [...selectedCategoriesData.value, label];
    }
  };

  // Хуки жизненного цикла
  onMounted(() => {
    // Ждем отрисовки DOM для получения правильных размеров
    nextTick(() => {
      handleResize();
    });

    // Добавляем слушатели событий
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
  });

  // Наблюдатели
  watch(filteredProducts, () => {
    updateProductsToShow();
  });

  // Наблюдатель для initial load продуктов
  watch(
    products,
    (newProducts) => {
      if (newProducts.length > 0) {
        updateProductsToShow();
      }
    },
    { immediate: true }
  );
</script>

<style module scoped>
  .rowContainer {
    display: flex;
    flex-direction: row;
    inline-size: 95%;
    max-inline-size: 100%;
    block-size: fit-content;
    gap: 25px;
  }

  .containerFixed {
    height: fit-content;
    padding-inline: 8px;
    min-width: 70px;
    width: 180px;
  }

  .filters {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 50px;
  }

  .products {
    width: 80%;
    height: fit-content;
    max-width: 1500px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .spinnerContainer {
    width: fit-content;
    height: fit-content;
    display: block;
    align-self: center;
    margin-left: 100px;
  }

  .spinner {
    display: block;
    position: absolute !important;
    margin-left: 50px;
  }

  .spinnerLoadCards {
    position: relative !important;
  }

  .greyLine {
    width: 1px;
    min-height: 100vh;

    background-color: var(--toggle-color);
    opacity: 0.6;
  }
  .noProductsContainer {
    inline-size: 60%;
    block-size: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-inline: auto;
    margin-top: 50px;
    gap: 20px;
  }

  .noProducts {
    font-size: 22px;
    color: var(--text-color);
    text-align: center;
  }

  .noProductsSVG {
    width: 60px;
    height: 60px;
    stroke: var(--text-color);
  }

  @media (890px <= width <= 1180px) {
    .rowContainer {
      gap: 15px;
    }

    .containerFixed {
      width: 145px;
      padding: 0;
    }

    .products {
      gap: 18px;
    }

    .filters {
      gap: 30px;
    }
  }

  @media (600px <= width <= 889px) {
    .rowContainer {
      gap: 15px;
    }

    .containerFixed {
      width: 130px;
      padding: 0;
    }

    .products {
      gap: 16px;
    }

    .filters {
      gap: 18px;
    }

    .noProducts {
      font-size: 18px;
    }

    .noProductsSVG {
      width: 40px;
      height: 40px;
    }
  }

  @media (513px <= width <= 599px) {
    .rowContainer {
      gap: 10px;
    }

    .containerFixed {
      width: 100px;
      padding: 0;
    }

    .products {
      gap: 8px;
    }

    .filters {
      gap: 15px;
    }

    .noProductsContainer {
      margin-top: 30px;
    }

    .noProducts {
      font-size: 15px;
    }

    .noProductsSVG {
      width: 28px;
      height: 28px;
    }
  }

  @media (385px <= width <= 512px) {
    .rowContainer {
      gap: 14px;
    }

    .containerFixed {
      width: 85px;
      padding: 0;
    }

    .products {
      gap: 12px;
    }

    .filters {
      gap: 12px;
    }

    .noProductsContainer {
      margin-top: 35px;
    }

    .noProducts {
      font-size: 13px;
    }

    .noProductsSVG {
      width: 21px;
      height: 21px;
    }
  }

  @media (width <= 384px) {
    .rowContainer {
      gap: 9px;
    }

    .containerFixed {
      width: 85px;
      padding: 0;
    }

    .products {
      gap: 10px;
    }

    .filters {
      gap: 12px;
    }

    .noProductsContainer {
      margin-top: 20px;
    }

    .noProducts {
      font-size: 12px;
    }

    .noProductsSVG {
      width: 17px;
      height: 17px;
    }
  }
</style>
