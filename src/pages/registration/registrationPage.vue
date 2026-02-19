<template>
  <div :class="$style.container">
    <RegistrationHeaderUI @close="handleClose" />

    <Stepper :current-step="currentStep" :overall-steps="2" />

    <PasswordStep
      v-if="currentStep === 1"
      v-model:email="email"
      v-model:password="password"
      @click-button="handleNextStep"
    />

    <div v-if="currentStep === 2" :class="$style.step2">
      <FormUserInformationStepTwo
        :hidden-avatar-input="false"
        :gender-options="genderOptions"
        :name-value="name"
        :surname-value="surname"
        :gender-value="gender"
        :location-value="location"
        :birthday-date-value="birthdayDate"
        @update:name-value="handleNameUpdate"
        @update:surname-value="handleSurnameUpdate"
        @update:gender-value="handleGenderUpdate"
        @update:location-value="handleLocationUpdate"
        @update:birthday-date-value="handleBirthdayDateUpdate"
        @change-avatar-url="handleAvatarUpdate"
      />

      <div :class="$style.buttonsContainer">
        <ButtonUI @click="handlePreviousStep" label="Назад" :class="$style.buttonPadding" />

        <ButtonUI
          data-cy="registrationButton"
          :disabled="!isRegistrationEnabled"
          @click="handleRegistration"
          label="Зарегистрироваться"
          :class="$style.buttonPadding"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import type { RegistrationData } from '../../types';
  import RegistrationHeaderUI from '../../ui/RegistrationHeader/RegistrationHeader.vue';
  import Stepper from './stepper/Stepper.vue';
  import ButtonUI from '../../ui/button/Button.vue';
  import PasswordStep from './step1/RegistrationStep1.vue';
  import FormUserInformationStepTwo from './step2/RegistrationStep2.vue';
  import { useTypedStore } from '../../store/index';

  const router = useRouter();
  const store = useTypedStore();

  // Реактивные состояния
  const email = ref<string>('');
  const password = ref<string>('');
  const name = ref<string>('');
  const surname = ref<string>('');
  const avatar = ref<File | null>(null);
  const gender = ref<string>('');
  const location = ref<string>('');
  const birthdayDate = ref<string>('');
  const currentStep = ref<number>(1);

  // Данные для регистрации
  const regData = ref<RegistrationData>({
    email: '',
    password: '',
    name: '',
    surname: '',
    avatar: '',
    gender: '',
    location: '',
    birthdayDate: '',
  });

  // Опции для выбора пола
  const genderOptions = [
    { value: 'man', label: 'Мужской' },
    { value: 'woman', label: 'Женский' },
  ];

  // Следим за изменениями полей и обновляем regData
  watch(
    [email, password, name, surname, gender, location, birthdayDate],
    () => {
      regData.value = {
        email: email.value,
        password: password.value,
        name: name.value,
        surname: surname.value,
        avatar: avatar.value ? URL.createObjectURL(avatar.value) : '',
        gender: gender.value,
        location: location.value,
        birthdayDate: birthdayDate.value,
      };
      console.log(regData.value);
    },
    { deep: true }
  );

  // Проверка возможности регистрации
  const isRegistrationEnabled = computed(() => {
    const data = regData.value;
    return (
      !!data.email &&
      !!data.password &&
      !!data.birthdayDate &&
      !!data.gender &&
      !!data.location &&
      !!data.name &&
      !!data.surname
    );
  });

  // Обработчики событий
  const handleClose = () => {
    router.back();
  };

  const handleNextStep = () => {
    if (currentStep.value < 2) {
      currentStep.value++;
    }
  };

  const handlePreviousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  // Обработчики обновления полей
  const handleEmailUpdate = (value: string) => {
    email.value = value;
  };

  const handlePasswordUpdate = (value: string) => {
    password.value = value;
  };

  const handleNameUpdate = (value: string) => {
    name.value = value;
  };

  const handleSurnameUpdate = (value: string) => {
    surname.value = value;
  };

  const handleAvatarUpdate = (file: File) => {
    avatar.value = file;
  };

  const handleGenderUpdate = (value: string) => {
    gender.value = value;
  };

  const handleLocationUpdate = (value: string) => {
    location.value = value;
  };

  const handleBirthdayDateUpdate = (value: string) => {
    birthdayDate.value = value;
  };

  const handleRegistration = async () => {
    if (!isRegistrationEnabled.value) return;

    try {
      localStorage.setItem('regData', JSON.stringify(regData.value));

      await store.dispatch('user/registerUser', regData.value);

      router.push('/');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };
</script>

<style module scoped>
  .container {
    inline-size: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .step2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    inline-size: 80%;
    max-inline-size: 436px;
    gap: 35px;
  }

  .buttonsContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 50px;
    min-width: 380px;
  }

  .buttonPadding {
    padding-inline: 15px !important;
    min-width: 150px !important;
  }

  @media (width <= 640px) {
    .step2 {
      inline-size: 85%;
    }

    .buttonsContainer {
      gap: 35px;
    }

    .buttonPadding {
      padding-inline: 8px !important;
      min-width: 120px !important;
    }
  }

  @media (width <= 500px) {
    .container {
      gap: 10px;
    }
  }
</style>
