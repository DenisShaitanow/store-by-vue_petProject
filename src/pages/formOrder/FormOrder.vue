<template>
  <div :class="$style.container">
    <span :class="$style.selectPay">Выберете способ получения</span>
    <div :class="$style.twoButtons">
      <div
        :class="[$style.selectPayButton, { [$style.select]: !formData.selectСourier }]"
        @click="handleSelectNoCourier"
      >
        Самовывоз
      </div>
      <div
        :class="[$style.selectPayButton, { [$style.select]: formData.selectСourier }]"
        @click="handleSelectCourier"
      >
        Курьер
      </div>
    </div>

    <InputUI
      v-if="formData.selectСourier"
      data-cy="inputAdressDelivery"
      name="adress"
      type="text"
      title="Адрес"
      :model-value="formData.adress"
      @update:model-value="handleChangeAdress"
      placeholder="Введите адрес"
    />

    <InputDropDown
      v-else
      :class="$style.pointTake"
      id="1"
      title="Пункт выдачи"
      :with-input="false"
      :model-value="formData.adressPoint"
      @update:model-value="handleChangePoint"
      placeholder="Выберите удобный пункт выдачи"
      :options="pickupOptions"
    />

    <span :class="$style.selectPay">Выберете способ оплаты</span>
    <div :class="$style.twoButtons">
      <div
        :class="[$style.selectPayButton, { [$style.select]: formData.formPaySelf }]"
        @click="handleSelectformPaySelf"
      >
        Оплата при получении
      </div>
      <div
        :class="[$style.selectPayButton, { [$style.select]: !formData.formPaySelf }]"
        @click="handleSelectformPayOnline"
      >
        Оплата картой онлайн
      </div>
    </div>

    <template v-if="!formData.formPaySelf">
      <span :class="$style.infoCard">Введите данные карты</span>
      <div :class="$style.cardInputs">
        <InputUI
          :error="!!errors.numberCardError"
          :error-text="errors.numberCardError"
          name="numberCard"
          type="text"
          title="Номер карты"
          :model-value="formData.numberCard"
          @update:model-value="handleChangeNumberCard"
          placeholder="Введите номер карты"
          :maxLength="19"
        />
        <InputUI
          :error="!!errors.cvvError"
          :error-text="errors.cvvError"
          :half-size="true"
          name="cvvCard"
          type="text"
          title="CVV"
          :model-value="formData.CVV"
          @update:model-value="handleChangeCVV"
          placeholder="Введите код с обратной стороны"
          :maxLength="3"
        />
        <InputUI
          :error="!!errors.personCardError"
          :error-text="errors.personCardError"
          name="personCard"
          type="text"
          title="Владелец карты"
          :model-value="formData.PersonCard"
          @update:model-value="handleChangePersonCard"
          placeholder="Введите имя владельца"
        />
      </div>
    </template>

    <ButtonUI
      data-cy="makePurchase"
      :class="$style.buttonBuy"
      label="Совершить покупку"
      :disabled="buttonBuyDisabled"
      @click="handleBuy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { IFormOrderData } from '../../types/index';
import InputUI from '../../ui/input/Input.vue';
import InputDropDown from '../../ui/inputDropDown/imputDropDownSimple/inputDropDown.vue';
import ButtonUI from '../../ui/button/Button.vue';
import { useTypedStore } from '../../store/index';

// Типизация для ошибок
interface Errors {
  numberCardError: string;
  personCardError: string;
  cvvError: string;
}



// Router
const router = useRouter();

// Store
const store = useTypedStore()

// Селекторы
const basket = computed(() => store.getters['userData/selectBasket'] || []);
const basketListId = computed(() => 
  basket.value.map((product: { id: string | number }) => product.id)
);

// Константы
const pickupOptions = [
  { value: "ул.Мичурина, д.23", label: "ул.Мичурина, д.23" },
  { value: "пр-т Королева, д.26", label: "пр-т Королева, д.26" },
  { value: "пл. Ленина, д.17", label: "пл. Ленина, д.17" },
  { value: "ул. Кирова, д.17", label: "ул. Кирова, д.17" },
  { value: "ул. Сахарова, д.1", label: "ул. Сахарова, д.1" },
];

// Вспомогательные функции
const formatCardNumber = (inputValue: string): string => {
  const cleanValue = inputValue.replace(/\s/g, "").substring(0, 16);
  let formattedValue = "";
  for (let i = 0; i < cleanValue.length; i += 4) {
    if (i > 0) {
      formattedValue += " ";
    }
    formattedValue += cleanValue.substring(i, Math.min(cleanValue.length, i + 4));
  }
  return formattedValue;
};

const validateNumberCard = (value: string): boolean =>
  /^\d+$/.test(value.replace(/\s/g, ""));
const validatePersonCard = (value: string): boolean => /^[A-Za-z\s]+$/.test(value);
const validateCVV = (value: string): boolean => /^\d{3}$/.test(value);

// Получаем данные из localStorage
const getInitialFormData = (): IFormOrderData => {
  const storedFormDataString = localStorage.getItem("orderForm");
  if (storedFormDataString) {
    try {
      return JSON.parse(storedFormDataString);
    } catch (e) {
      console.error('Error parsing stored form data', e);
    }
  }
  
  return {
    selectСourier: true,
    adress: "",
    adressPoint: "",
    formPaySelf: true,
    numberCard: "",
    PersonCard: "",
    CVV: "",
    productList: [],
  };
};

// Состояния
const formData = ref<IFormOrderData>(getInitialFormData());

const errors = ref<Errors>({
  numberCardError: "",
  personCardError: "",
  cvvError: "",
});
const buttonBuyDisabled = ref<boolean>(true);

// Обработчики
const handleChangeNumberCard = (value: string) => {
  const cleanedAndFormattedValue = formatCardNumber(value);
  const valid = validateNumberCard(cleanedAndFormattedValue);
  
  errors.value = {
    ...errors.value,
    numberCardError: valid ? "" : "Некорректный номер карты",
  };
  
  formData.value = { ...formData.value, numberCard: cleanedAndFormattedValue };
};

const handleChangePersonCard = (value: string) => {
  const valid = validatePersonCard(value);
  
  errors.value = {
    ...errors.value,
    personCardError: valid ? "" : "Имя владельца должно содержать только латиницу",
  };
  
  formData.value = { ...formData.value, PersonCard: value };
};

const handleChangeCVV = (value: string) => {
  const cvvChecked = value.substring(0, 3);
  const valid = validateCVV(cvvChecked);
  
  
  errors.value = {
    ...errors.value,
    cvvError: valid ? "" : "Код CVV должен содержать три цифры",
  };
  
  
  formData.value = { ...formData.value, CVV: cvvChecked };
  console.log(formData.value.CVV)
};

const handleChangeAdress = (value: string) => {
  formData.value = { ...formData.value, adress: value };
};

const handleChangePoint = (value: string) => {
  formData.value = { ...formData.value, adressPoint: value };
};

const handleBuy = () => {
  store.dispatch('userData/doOrder', formData.value);
  router.push("/orderComplited");
};

const handleSelectNoCourier = () => {
    formData.value = {...formData.value, selectСourier: false}
}

const handleSelectCourier = () => {
  formData.value = {...formData.value, selectСourier: true}
}

const handleSelectformPaySelf = () => {
  formData.value = {...formData.value, formPaySelf: true}
}

const handleSelectformPayOnline = () => {
  formData.value = {...formData.value, formPaySelf: false}
}


// Watchers
watch(basketListId, (newList) => {
  formData.value = { ...formData.value, productList: newList };
}, { immediate: true });

watch(formData, (newData) => {
  localStorage.setItem("orderForm", JSON.stringify(newData));
}, { deep: true });

// Проверка валидности формы
watch([formData, errors], () => {
  const isValidAddressSelection =
    (formData.value.selectСourier && formData.value.adress.trim()) ||
    (!formData.value.selectСourier &&
      formData.value.adressPoint.trim() &&
      formData.value.productList.length > 0);

  const isPaymentDataComplete =
    formData.value.formPaySelf ||
    (!formData.value.formPaySelf &&
      formData.value.numberCard.trim() !== "" &&
      formData.value.PersonCard.trim() !== "" &&
      formData.value.CVV.trim() !== "" &&
      !errors.value.cvvError &&
      !errors.value.numberCardError &&
      !errors.value.personCardError);

  buttonBuyDisabled.value = !(isValidAddressSelection && isPaymentDataComplete);
}, { deep: true, immediate: true });

// Инициализация
onMounted(() => {
  // Проверяем все значения при монтировании
  const numberCardValid = validateNumberCard(formData.value.numberCard);
  const personCardValid = validatePersonCard(formData.value.PersonCard);
  const cvvValid = validateCVV(formData.value.CVV);

  errors.value = {
    numberCardError: numberCardValid ? "" : "Некорректный номер карты",
    personCardError: personCardValid ? "" : "Имя владельца должно содержать только латиницу",
    cvvError: cvvValid ? "" : "Код CVV должен содержать три цифры",
  };
});
</script>

<style module scoped>
    .container {
    display: flex;
    flex-direction: column;
    max-inline-size: 660px;
    min-block-size: 400px;
    margin-inline: auto;
    background-color: rgba(
        var(--accent-color-r),
        var(--accent-color-g),
        var(--accent-color-b),
        0.2
    );
    padding: 30px;
    gap: 16px;
    border-radius: 10px;
    border: solid 1px var(--accent-color);
    }

    .selectPay {
    display: block;
    max-inline-size: 630px;
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-h2);
    line-height: var(--line-height-h2);
    color: var(--text-color);
    }

    .twoButtons {
    display: flex;
    gap: 6px;
    }

    .selectPayButton {
    display: flex;
    justify-content: center;
    align-items: center;
    inline-size: fit-content;
    min-inline-size: 55px;
    block-size: 37px;
    background-color: var(--accent-color);
    border-radius: 5px;
    padding-inline: 7px;
    padding-block: 4px;
    cursor: pointer;
    font-size: var(--font-size-h4);
    font-weight: var(--font-weight-h4);
    line-height: var(--line-height-h4);
    }

    .select {
    border: solid 1px red;
    }

    .infoCard {
    display: block;
    font-size: var(--font-size-h3);
    font-weight: var(--font-weight-h3);
    line-height: var(--line-height-h3);
    color: var(--text-color);
    }

    .cardInputs {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 25px;
    row-gap: 10px;
    }

    .buttonBuy {
    width: 60%;
    align-self: center;
    margin-top: 15px;
    }

    @media (626px <= width <= 1200px) {
    .buttonBuy {
        height: 36px;
        font-size: 18px;
    }
    }

    @media (width <= 625px) {
    .buttonBuy {
        height: 36px;
        font-size: 16px;
    }
    }

    @media (width <= 500px) {
    .selectPay {
        font-size: var(--font-size-h3);
    }

    .selectPayButton {
        font-size: var(--font-size-h5);
        font-weight: var(--font-weight-h5);
        line-height: var(--line-height-h5);
        block-size: fit-content;
    }

    .buttonBuy {
        height: 33px;
        font-size: 15px;
    }
    }

</style>