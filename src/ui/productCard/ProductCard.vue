<template>
  <div
    ref="containerRef"
    class="product-card"
    :class="[props.className, $style.container]"
    :data-cy="`productCard-${props.id}`"
    @click="handleCardClick"
  >
    <img :src="props.image" :class="[$style.image]" alt="product-image" />
    <p :class="[$style.price]">{{ formattedPrice }}</p>
    <p :class="[$style.title]">{{ props.title }}</p>
    <p :class="[$style.description]">{{ props.shortDescription }}</p>
    <span
      ref="heartlikeRef"
      :class="[{ [$style.likeDone]: isLiked },
                    $style.like]"
      @click.stop="handleLike"
    ></span>
  </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, defineProps } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';

    type Category =
        | "t-shirts"
        | "shoes"
        | "trousers"
        | "jackets"
        | "hats"
        | "underwear"
        | "accessories";

    // Определяем пропсы
    interface Props {
    id: string
    price: number
    title: string
    description: string
    image: string
    shortDescription: string
    category: Category
    sex: 'man' | 'woman'
    className?: string
    isLiked: boolean
    }

    const props = defineProps<Props>()

    // Рефы
    const containerRef = ref<HTMLDivElement>()
    const heartlikeRef = ref<HTMLSpanElement>()

    // Состояния
    const isLiked = ref(props.isLiked)

    // Внешние зависимости
    const router = useRouter()
    const store = useStore()

    // Вычисляемые свойства
    const formattedPrice = computed(() => `${props.price}₽`)

    // Обработчики событий
    const handleCardClick = (event: MouseEvent) => {
    if (heartlikeRef.value && event.target !== heartlikeRef.value) {
        router.push(`/${props.id}`)
    }
    }

    const handleLike = () => {
    // Диспатч экшена для добавления/удаления из избранного
    store.dispatch('userData/toggleFavorite', props.id)
    isLiked.value = !isLiked.value
    }


</script>

<style module scoped>
    .container {
    position: relative;
    display: flex;
    flex-direction: column;
    inline-size: 220px;

    block-size: 350px;

    border-radius: 30px;
    border: 1px solid;
    border-color: var(--accent-color);
    font-family: var(--second-family);
    color: var(--text-color);
    }

    .container:hover {
    cursor: pointer;
    }

    .image {
    display: block;
    inline-size: 100%;
    block-size: 63%;
    object-fit: cover;
    border-radius: inherit;
    }

    .title {
    display: block;
    padding-inline: 9px;
    font-size: 18px;
    font-weight: 800;
    line-height: 120%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important; /* Важно установить именно webkit-box */
    -webkit-line-clamp: 2; /* Обязательно с дефисом и префиксом */
    -webkit-box-orient: vertical; /* Ориентация вертикальной коробки */
    }

    .description {
    padding-inline: 9px;
    padding-block: 1px;
    margin-top: 2px;
    font-size: var(--font-size-h4);
    font-weight: var(--font-weight-caption); /* 400 */
    line-height: 110%; /* 133% */
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important; /* Важно установить именно webkit-box */
    -webkit-line-clamp: 2; /* Обязательно с дефисом и префиксом */
    -webkit-box-orient: vertical; /* Ориентация вертикальной коробки */
    }

    .category {
    position: absolute;
    top: 97px;
    right: 7px;
    inline-size: fit-content;
    block-size: fit-content;
    display: block;
    border-radius: 5px;
    background-color: rgba(80, 136, 38, 0.5);
    color: brown;
    padding: 3px;
    font-size: 10px;
    }

    .price {
    padding-inline: 9px;
    font-size: var(--font-size-h3);
    font-weight: var(--font-weight-h3);
    line-height: var(--line-height-h3);
    color: brown;
    font-weight: 700;
    padding-block: 5px;
    margin-top: 2px;
    }

    .like {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 24px;
    height: 24px;
    background-image: url("../assets/like.svg");
    }

    .likeDone {
    background-image: url("../assets/like-red.svg");
    }

    @media (1180px <= width <= 1440px) {
    .container {
        inline-size: 180px;
        block-size: 270px;
        border-radius: 20px;
    }

    .title {
        font-size: 14px;
        font-weight: 500;
        line-height: 120%;
        padding-block: 1px;
    }

    .description {
        font-size: 12px;
        font-weight: 300;
        line-height: 100%;
    }

    .price {
        font-size: 13px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 3px;
    }
    }

    @media (890px <= width <= 1179px) {
    .container {
        inline-size: 150px;
        block-size: 225px;
        border-radius: 15px;
    }

    .title {
        font-size: 12px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 1px;
    }

    .description {
        font-size: 10px;
        font-weight: 300;
        line-height: 100%;
    }

    .price {
        font-size: 13px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 3px;
    }

    .like {
        top: 10px;
        right: 10px;
        width: 18px;
        height: 18px;
    }
    }

    @media (600px <= width <= 889px) {
    .container {
        inline-size: 120px;
        block-size: 180px;
        border-radius: 10px;
    }

    .title {
        font-size: 10px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 1px;
    }

    .description {
        font-size: 9px;
        font-weight: 300;
        line-height: 100%;
        margin-top: 1px;
    }

    .price {
        font-size: 11px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 3px;
    }

    .like {
        top: 7px;
        right: 7px;
        width: 15px;
        height: 15px;
    }

    .image {
        block-size: 59%;
    }
    }

    @media (513px <= width <= 599px) {
    .container {
        inline-size: 100px;
        block-size: 140px;
        border-radius: 7px;
    }

    .title {
        font-size: 9px;
        font-weight: 500;
        line-height: 110%;
    }

    .description {
        font-size: 7px;
        font-weight: 300;
        line-height: 100%;
        margin-top: 1px;
    }

    .price {
        font-size: 10px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 1px;
    }

    .like {
        top: 5px;
        right: 5px;
        width: 12px;
        height: 12px;
    }

    .image {
        block-size: 55%;
    }
    }

    @media (430px <= width <= 512px) {
    .container {
        inline-size: 120px;
        block-size: 160px;
        border-radius: 10px;
    }

    .title {
        font-size: 10px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 1px;
    }

    .description {
        font-size: 9px;
        font-weight: 300;
        line-height: 100%;
        margin-top: 1px;
    }

    .price {
        font-size: 11px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 3px;
    }

    .like {
        top: 7px;
        right: 7px;
        width: 15px;
        height: 15px;
    }

    .image {
        block-size: 59%;
    }
    }

    @media (width <= 429px) {
    .container {
        inline-size: 100px;
        block-size: 140px;
        border-radius: 10px;
    }

    .title {
        font-size: 9px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 1px;
    }

    .description {
        font-size: 7px;
        font-weight: 300;
        line-height: 100%;
        margin-top: 0;
    }

    .like {
        top: 7px;
        right: 7px;
        width: 15px;
        height: 15px;
    }

    .price {
        margin-top: 2px;
        font-size: 11px;
        font-weight: 500;
        line-height: 110%;
        padding-block: 1px;
    }

        .image {
            block-size: 55%;
        }
    }

</style>