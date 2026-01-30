<template>
  
    <div :class="$style.rowContainer">
      <div :class="$style.containerFixed">
        <div :class="$style.filters">
          <div>
            <CheckboxGroupUI
              title="Пол"
              :selected-items="selectedSex"
              :field-names="['Для женщин', 'Для мужчин']"
              @change="handleSex"
            />
          </div>
          <div>
            <CheckboxDropdown
              :selected-values="selectedCategories"
              @change="handleCategories"
              title="Категория"
              staticMode
              :options="[
                'Рубашки',
                'Обувь',
                'Верхняя одежда',
                'Нижнее белье',
                'Головные уборы',
                'Брюки',
                'Аксессуары'
              ]"
            />
          </div>
        </div>
      </div>
      <span :class="$style.greyLine"></span>
      <div :class="$style.products" ref="productsContainerRef">
        <SpinnerPulse v-if="isLoading" :class="$style.spinner" />
        <template v-else>
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
      </div>
    </div>
    <div v-if="isLoadingMore" :class="$style.spinnerContainer">
      <SpinnerPulse :class="$style.spinnerLoadCards" />
    </div>
  
</template>

<script setup lang="ts">

    import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
    import { useStore } from 'vuex'
    import ProductCard from '../../ui/productCard/ProductCard.vue'
    import CheckboxGroupUI from '../../ui/checkbox/CheckboxGroup.vue'
    import CheckboxDropdown from '../../ui/checkboxDropdown/CheckboxDropdown.vue'
    import SpinnerPulse from '../../ui/spinnerPulse/SpinnerPulse.vue'
    import type { IProduct } from '../../ui/productCard/ProductCard.vue'
    import { useTypedStore } from '../../store/index';

    // Константы
    const categoryMapping: string[] = [
    't-shirts',
    'shoes',
    'jackets',
    'underwear',
    'hats',
    'trousers',
    'accessories'
    ]

    const sexMapping: Record<string, string> = {
    'Для мужчин': 'man',
    'Для женщин': 'woman'
    }

    // Рефы
    const productsContainerRef = ref<HTMLDivElement>()
    const productCardRef = ref<HTMLDivElement>()

    // Состояния
    const isLoading = ref(false)
    const productsToShow = ref<IProduct[]>([])
    const isLoadingMore = ref(false)
    const selectedSex = ref<string[]>([])
    const selectedSexData = ref<string[]>([])
    const selectedCategories = ref<(string | number)[]>([])
    const selectedCategoriesData = ref<string[]>([])

    // Добавляем таймер для дебаунсинга
    let scrollTimeout: NodeJS.Timeout | null = null

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
 

    // Store
    const store = useTypedStore()

    const products = ref<IProduct[]>([]);

    const selectProducts = computed(() => 
        store.getters['userData/selectProducts'] || []
    );

      const selectLoadingProducts = computed(() => 
        store.getters['userData/selectLoadingProducts'] || false
    );

    
    watch(selectLoadingProducts, (newValue: boolean) => {
        isLoading.value = newValue
    })

    const filteredProducts = computed<IProduct[]>(() => {
    return products.value.filter((product) => {
        // Проверяем выбор категории
        if (
        selectedCategoriesData.value.length > 0 &&
        !selectedCategoriesData.value.includes(product.category)
        ) {
        return false
        }
        // Проверяем выбор пола
        if (
        selectedSexData.value.length > 0 &&
        !selectedSexData.value.includes(product.sex)
        ) {
        return false
        }
        return true
    })
    })

    // Методы
    const calculateVisibleProductsCount = (width: number) => {
        if (!productCardRef.value) return 1
        const productCardWidth = productCardRef.value.clientWidth
        const cardsPerRow = Math.floor(
            (width - 0.1 * width) / (productCardWidth || 160)
        )
        return cardsPerRow * 6
    }

    const loadProducts = async () => {
        await store.dispatch('userData/getProducts');
        
        // Обновляем локальные данные после загрузки
        products.value = selectProducts.value;
    }

    const updateProductsToShow = () => {
        if (productsContainerRef.value) {
            const containerWidth = productsContainerRef.value.clientWidth
            const visibleCardsCount = calculateVisibleProductsCount(containerWidth)
            productsToShow.value = filteredProducts.value.slice(0, visibleCardsCount)
        }
    }

    const handleResize = () => {
        if (productsContainerRef.value) {
            const currentWidth = productsContainerRef.value.clientWidth
            const newVisibleCount = calculateVisibleProductsCount(currentWidth)
            productsToShow.value = filteredProducts.value.slice(0, newVisibleCount)
        }
    }

    if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
 
    const handleScroll = () => {
            // Дебаунсинг
            if (scrollTimeout) {
                clearTimeout(scrollTimeout)
            }

            scrollTimeout = setTimeout(() => {
                const bottomReached =
                document.documentElement.scrollTop + window.innerHeight >=
                document.documentElement.offsetHeight - 50

                if (
                bottomReached &&
                !isLoadingMore.value &&
                productsToShow.value.length < products.value.length
                ) {

                
                    isLoadingMore.value = true
                    console.log('Loading started...')

                    const nextBatchSize = calculateVisibleProductsCount(
                        productsContainerRef.value?.clientWidth || 1200
                    )
                    const startIndex = productsToShow.value.length
                    const endIndex = Math.min(startIndex + nextBatchSize, products.value.length)
                    console.log('Loading:', startIndex, 'to', endIndex)

                    // Имитация асинхронной загрузки с задержкой
                    setTimeout(() => {
                        // 3. Добавляем новые товары
                        productsToShow.value = [
                        ...productsToShow.value,
                        ...filteredProducts.value.slice(startIndex, endIndex)
                        ]

                        // 4. Ждем отрисовки DOM и скрываем спиннер
                        nextTick()
                        isLoadingMore.value = false
                        console.log('Loading complete. Total:', productsToShow.value.length)
                        
                    }, 1000) // Задержка для имитации загрузки
                }
            }, 150) // Задержка для дебаунсинга
    }

    const handleSex = (e: { target: { id: string } }) => {
    const selectedItem: string = e.target.id
    const selectedItemData: string = sexMapping[selectedItem]
    
    if (selectedSex.value.includes(selectedItem)) {
        selectedSex.value = selectedSex.value.filter((item) => item !== selectedItem)
        selectedSexData.value = selectedSexData.value.filter((item) => item !== selectedItemData)
    } else {
        selectedSex.value = [...selectedSex.value, selectedItem]
        selectedSexData.value = [...selectedSexData.value, selectedItemData]
    }
    }

    const handleCategories = (selectedValues: (string | number)[]) => {
    selectedCategories.value = selectedValues
    selectedCategoriesData.value = selectedValues.map((item) => 
        categoryMapping[item as number]
    )
    }

    // Хуки жизненного цикла
    onMounted(() => {
        loadProducts()
        
        // Ждем отрисовки DOM для получения правильных размеров
        nextTick(() => {
            handleResize()
        })  
        
        // Добавляем слушатели событий
        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleScroll)
        })

        onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
    })

    // Наблюдатели
    watch(filteredProducts, () => {
        updateProductsToShow()
    })

    // Наблюдатель для initial load продуктов
    watch(products, (newProducts) => {
    if (newProducts.length > 0) {
        updateProductsToShow()
    }
    }, { immediate: true })
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
    }

</style>