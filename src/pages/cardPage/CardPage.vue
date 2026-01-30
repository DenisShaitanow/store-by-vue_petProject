<template>
  <div :class="$style.container" v-if="idCard && card">
    <div :class="$style.leftHalf">
      <img :class="$style.image" :src="card.image" :alt="card.title" />
      <p :class="$style.price">{{ `${card.price}₽` }}</p>
      <ButtonUI
        :data-cy="'putToBasketButton'"
        :disabled="!isAuth"
        :label="!isAuth 
          ? 'Авторизуйтесь пожалуйста' 
          : putToBasketButton 
            ? 'Убрать из корзины' 
            : 'Положить в корзину'"
        :class="$style.button"
        @click="handlePutToBasket"
      />
      <span v-if="!isAuth" :class="$style.regPleaseTransparant">
        Для покупки товара, вам необходимо авторизоваться.
      </span>
    </div>

    <div :class="$style.information">
      <h2 :class="$style.title">{{ card.title }}</h2>
      <p :class="$style.description">{{ card.description }}</p>
    </div>
    
    <router-link to="/" :class="$style.back">
      <ButtonUI label="Назад" :class="$style.buttonBack" />
    </router-link>
  </div>

  <div v-else :class="[$style.container, $style.column]">
    <svg
          className={styles.svg}
          width="200px"
          height="200px"
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <title>ic_fluent_emoji_sad_24_filled</title>
          <desc>Created with Sketch.</desc>
          <g
            id="🔍-Product-Icons"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="ic_fluent_emoji_sad_24_filled"
              fill="#abd27a"
              fill-rule="nonzero"
            >
              <path
                d="M12.0000002,1.99896738 C17.523704,1.99896738 22.0015507,6.47681407 22.0015507,12.0005179 C22.0015507,17.5242217 17.523704,22.0020684 12.0000002,22.0020684 C6.47629639,22.0020684 1.99844971,17.5242217 1.99844971,12.0005179 C1.99844971,6.47681407 6.47629639,1.99896738 12.0000002,1.99896738 Z M12.0000001,13.4979816 C10.3651558,13.4979816 8.83296242,14.155799 7.71175097,15.3007764 C7.4219453,15.5967249 7.4269251,16.0715726 7.72287367,16.3613782 C8.01882223,16.6511839 8.49366985,16.6462041 8.78347552,16.3502555 C9.62535029,15.4905359 10.7726114,14.9979816 12.0000001,14.9979816 C13.2246935,14.9979816 14.3696444,15.4883577 15.211114,16.3447396 C15.5014236,16.6401939 15.976279,16.6443646 16.2717333,16.354055 C16.5671876,16.0637455 16.5713583,15.5888901 16.2810488,15.2934358 C15.1603686,14.1528953 13.6312483,13.4979816 12.0000001,13.4979816 Z M9.00044779,8.75115873 C8.3104845,8.75115873 7.75115873,9.3104845 7.75115873,10.0004478 C7.75115873,10.6904111 8.3104845,11.2497368 9.00044779,11.2497368 C9.69041108,11.2497368 10.2497368,10.6904111 10.2497368,10.0004478 C10.2497368,9.3104845 9.69041108,8.75115873 9.00044779,8.75115873 Z M15.0004478,8.75115873 C14.3104845,8.75115873 13.7511587,9.3104845 13.7511587,10.0004478 C13.7511587,10.6904111 14.3104845,11.2497368 15.0004478,11.2497368 C15.6904111,11.2497368 16.2497368,10.6904111 16.2497368,10.0004478 C16.2497368,9.3104845 15.6904111,8.75115873 15.0004478,8.75115873 Z"
                id="🎨-Color"
              ></path>
            </g>
          </g>
        </svg>
    <p :class="$style.notFoundParagraph">Товар не найден</p>
  </div>
</template>

<script setup>
        import { ref, computed, onMounted, watch } from 'vue'
        import { useRoute, useRouter } from 'vue-router'
        import { useStore } from 'vuex'
        import ButtonUI from '../../ui/button/Button.vue'
        import { useTypedStore } from '../../store/index';

        const route = useRoute()
        const router = useRouter()
        const store = useTypedStore()

        const idCard = route.params.idCard
        const putToBasketButton = ref(false)

        // Получаем данные из Vuex
        const products = computed(() => store.getters['userData/selectProducts'])
        const isAuth = computed(() => store.getters['user/selectIsAuth'])

        // Находим карточку
        const card = computed(() => {
            if (idCard) {
                return products.value.find(item => item.id === idCard)
            }
            return null
        })

        // Обработчик добавления/удаления из корзины
        const handlePutToBasket = () => {
        if (!card.value) return
        
        if (putToBasketButton.value) {
            store.dispatch('removeFromBusket', card.value)
        } else {
            store.dispatch('addToBusket', card.value)
        }
        
        putToBasketButton.value = !putToBasketButton.value
        }

</script>

<style module scoped>
    .container {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-self: center;
        margin: auto;
        inline-size: 80vw;
        max-inline-size: 1100px;
        min-inline-size: 193px;
        block-size: 65vw;
        min-block-size: 145px;
        max-block-size: 700px;
        padding: 3vw;
        border: solid var(--accent-color) 1px;
        border-radius: 50px;
        box-shadow: 0 0 25px var(--accent-color);
        gap: 10px;
        font-family: var(--second-family);
        color: var(--text-color);
        gap: 30px;
        }

        .notFoundParagraph {
        display: block;
        align-self: center;
        inline-size: fit-content;
        font-family: var(--font-family);
        color: var(--alarm-color, #e0796e);
        font-size: 60px;
        font-weight: 700;
        line-height: 130%;
        }

        .svg {
        inline-size: fit-content;
        block-size: fit-content;
        padding-bottom: 70px;
        }

        .leftHalf {
        display: flex;
        flex-direction: column;
        inline-size: 40%;
        block-size: 100%;
        gap: 15px;
        }

        .image {
        display: block;
        block-size: 60%;
        object-fit: cover;
        border-radius: 20px;
        }

        .regPleaseTransparant {
        inline-size: 100%;
        block-size: fit-content;
        font-size: 20px;
        font-weight: 650;
        line-height: 120%;
        color: var(--text-color);
        }

        .information {
        display: flex;
        flex-direction: column;
        gap: 35px;
        inline-size: 60%;
        block-size: 100%;
        }

        .title {
        display: block;
        padding-inline: 2px;
        font-size: 30px;
        font-weight: 650;
        line-height: 120%;
        max-inline-size: 70%;
        padding-right: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box !important; /* Важно установить именно webkit-box */
        -webkit-line-clamp: 2; /* Обязательно с дефисом и префиксом */
        -webkit-box-orient: vertical; /* Ориентация вертикальной коробки */
        }

        .description {
        display: block;
        padding-inline: 2px;
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
        margin-bottom: 4%;
        }

        .button {
        font-size: 17px !important;
        inline-size: 100%;
        }

        .buttonBack {
        inline-size: 100px;
        }

        .back {
        font-size: 17px !important;
        position: absolute;
        right: 35px;
        padding-inline: 20px !important;
        padding-block: 0px !important;
        }

        @media (1025px <= width <= 1440px) {
        .container {
            gap: 17px;
            border-radius: 45px;
        }

        .leftHalf {
            gap: 13px;
        }

        .price {
            padding-inline: 5px;
            padding-block: 1px;
            font-size: 25px;
            margin-bottom: 1 0px;
        }

        .title {
            font-size: 25px;
        }

        .description {
            font-size: 17px;
        }

        .button {
            font-size: 15px !important;
        }

        .back {
            font-size: 15px !important;
            height: 55px;
            border-radius: 12px;
            inline-size: fit-content;
        }

        .information {
            gap: 27px;
        }
        }

        @media (821px <= width <= 1024px) {
        .container {
            flex-direction: column;
            padding: 5%;
            gap: 14px;
            border-radius: 37px;
            box-shadow: 0 0 29px var(--accent-color);
            block-size: 80vh;
            max-block-size: 1000px;
        }

        .leftHalf {
            position: relative;
            inline-size: 100%;
            block-size: 70%;
            gap: 13px;
        }

        .image {
            inline-size: 100%;
            block-size: 80%;
        }

        .price {
            padding-inline: 5px;
            padding-block: 1px;
            margin-left: 3%;
            font-size: 30px;
            margin-top: 9px;
            margin-bottom: 0;
        }

        .title {
            inline-size: 100%;
            max-inline-size: 100%;
            block-size: fit-content;
            max-block-size: 30%;
            font-size: 22px;
            padding: 0;
        }

        .description {
            inline-size: 100%;
            block-size: 70%;
            font-size: 19px;
        }

        .button {
            position: absolute;
            top: 84%;
            right: 5%;
            inline-size: 25%;
            font-size: 20px !important;
            padding: 16px 9px;
            height: 42px;
            border-radius: 12px;
        }

        .regPleaseTransparant {
            position: absolute;
            top: 95%;
            right: 3%;
            inline-size: 35%;
            font-size: 14px;
        }

        .buttonBack {
            inline-size: 60px;
        }

        .back {
            font-size: 19px !important;
            padding-inline: 10px !important;
            right: 7%;
            top: 10%;
            border-radius: 9px;
            opacity: 0.7;
        }

        .information {
            inline-size: 100%;
            padding-inline: 3%;
            gap: 7%;
        }

        .regPleaseTransparant {
            position: absolute;
            top: 95%;
            right: 7%;
            inline-size: 35%;
            font-size: 14px;
        }
        }

        @media (681px <= width <= 820px) {
        .container {
            flex-direction: column;
            padding: 5%;
            gap: 26px;
            border-radius: 37px;
            box-shadow: 0 0 29px var(--accent-color);
            block-size: 80vh;
            max-block-size: 1000px;
        }

        .leftHalf {
            position: relative;
            inline-size: 100%;
            block-size: 60%;
            gap: 13px;
        }

        .image {
            inline-size: 100%;
            block-size: 80%;
        }

        .price {
            padding-inline: 5px;
            padding-block: 1px;
            margin-left: 3%;
            font-size: 30px;
            margin-top: 9px;
        }

        .title {
            inline-size: 100%;
            max-inline-size: 100%;
            block-size: fit-content;
            max-block-size: 30%;
            font-size: 22px;
            padding: 0;
        }

        .description {
            inline-size: 100%;
            block-size: 70%;
            font-size: 19px;
        }

        .button {
            position: absolute;
            top: 86%;
            right: 5%;
            inline-size: 25%;
            font-size: 15px !important;
            padding: 16px 9px;
            height: 42px;
            border-radius: 12px;
        }

        .buttonBack {
            inline-size: 60px;
        }

        .back {
            font-size: 19px !important;
            padding-inline: 10px !important;
            right: 7%;
            top: 8%;
            border-radius: 9px;
            opacity: 0.7;
        }

        .information {
            inline-size: 100%;
            padding-inline: 3%;
            gap: 7%;
        }

        .regPleaseTransparant {
            position: absolute;
            top: 98%;
            right: 4%;
            inline-size: 40%;
            font-size: 14px;
            text-align: center  ;
        }
        }

        @media (480px <= width <= 680px) {
        .container {
            flex-direction: column;
            padding: 5%;
            gap: 14px;
            border-radius: 37px;
            box-shadow: 0 0 29px var(--accent-color);
            block-size: 80vh;
            max-block-size: 1000px;
        }

        .leftHalf {
            position: relative;
            inline-size: 100%;
            block-size: 60%;
            gap: 13px;
        }

        .image {
            inline-size: 100%;
            block-size: 80%;
        }

        .price {
            padding-inline: 5px;
            padding-block: 1px;
            margin-left: 3%;
            font-size: 30px;
            margin-top: 9px;
        }

        .title {
            inline-size: 100%;
            max-inline-size: 100%;
            block-size: fit-content;
            max-block-size: 30%;
            font-size: 24px;
            padding: 0;
        }

        .description {
            inline-size: 100%;
            block-size: 70%;
            font-size: 18px;
        }

        .button {
            position: absolute;
            top: 86%;
            right: 5%;
            inline-size: 25%;
            font-size: 14px !important;
            padding: 16px 9px;
            height: 42px;
            border-radius: 12px;
        }

        .buttonBack {
            inline-size: 60px;
        }

        .back {
            font-size: 19px !important;
            padding-inline: 10px !important;
            right: 7%;
            top: 6%;
            border-radius: 9px;
            opacity: 0.7;
        }

        .information {
            inline-size: 100%;
            padding-inline: 3%;
            gap: 4%;
        }

        .regPleaseTransparant {
            position: absolute;
            top: 98%;
            right: 8%;
            inline-size: 40%;
            font-size: 10px;
            text-align: center;
        }
        }

        @media (441px <= width <= 540px) {
        .container {
            flex-direction: column;
            padding: 5%;
            gap: 20px;
            border-radius: 37px;
            box-shadow: 0 0 29px var(--accent-color);
            block-size: 80vh;
            max-block-size: 1000px;
        }

        .leftHalf {
            position: relative;
            inline-size: 100%;
            block-size: 60%;
            gap: 13px;
        }

        .image {
            inline-size: 100%;
            block-size: 80%;
        }

        .price {
            padding-inline: 5px;
            padding-block: 1px;
            margin-left: 3%;
            font-size: 24px;
            margin-top: 9px;
        }

        .title {
            inline-size: 100%;
            max-inline-size: 100%;
            block-size: fit-content;
            max-block-size: 30%;
            font-size: 24px;
            padding: 0;
        }

        .description {
            inline-size: 100%;
            block-size: 70%;
            font-size: 18px;
        }

        .button {
            position: absolute;
            top: 86%;
            right: 5%;
            inline-size: 25%;
            font-size: 13px !important;
            padding: 12px 7px;
            height: 36px;
            border-radius: 10px;
        }

        .buttonBack {
            inline-size: 60px;
        }

        .back {
            font-size: 19px !important;
            padding-inline: 10px !important;
            right: 7%;
            top: 6%;
            border-radius: 9px;
            opacity: 0.7;
        }

        .information {
            inline-size: 100%;
            padding-inline: 3%;
            gap: 4%;
        }

        .regPleaseTransparant {
            position: absolute;
            top: 96%;
            right: 8%;
            inline-size: 40%;
            font-size: 10px;
            text-align: center;
        }
        }

        @media (width <= 440px) {
        .container {
            flex-direction: column;
            padding: 5%;
            gap: 14px;
            border-radius: 37px;
            box-shadow: 0 0 29px var(--accent-color);
            block-size: 80vh;
            max-block-size: 1000px;
            min-inline-size: 300px;
            min-block-size: 590px;
        }

        .leftHalf {
            position: relative;
            inline-size: 100%;
            block-size: 60%;
            gap: 13px;
        }

        .image {
            inline-size: 100%;
            block-size: 80%;
        }

        .price {
            padding-inline: 5px;
            padding-block: 1px;
            margin-left: 3%;
            font-size: 18px;
            margin-top: 9px;
        }

        .title {
            inline-size: 100%;
            max-inline-size: 100%;
            block-size: fit-content;
            max-block-size: 30%;
            font-size: 18px;
            padding: 0;
        }

        .description {
            inline-size: 100%;
            block-size: 70%;
            font-size: 16px;
        }

        .button {
            position: absolute;
            top: 85%;
            right: 5%;
            inline-size: 25%;
            font-size: 10px !important;
            padding: 12px 7px;
            height: 36px;
            border-radius: 10px;
        }

        .buttonBack {
            inline-size: 60px;
        }

        .back {
            font-size: 19px !important;
            padding-inline: 10px !important;
            right: 7%;
            top: 5%;
            border-radius: 9px;
            opacity: 0.7;
        }

        .information {
            inline-size: 100%;
            padding-inline: 3%;
            gap: 4%;
        }

        .regPleaseTransparant {
            position: absolute;
            top: 95%;
            right: 8%;
            inline-size: 40%;
            font-size: 8px;
            text-align: center;
        }
        }

</style>