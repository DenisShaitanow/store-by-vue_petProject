<template>
  <div :class="$style.container">
    <AvatarEditAccount @image-change="handleAvatar" :initial-avatar-url="user?.avatar" />

    <FormUserInformationStepTwo
      :hidden-avatar-input="true"
      :gender-options="genderOptions"
      :name-value="personalCabinetData.name"
      @update:nameValue="handleChangeName"
      :surname-value="personalCabinetData.surname"
      @update:surnameValue="handleSurnameChange"
      @change-avatar-url="handleChangeAvatar"
      :gender-value="personalCabinetData.gender"
      @update:genderValue="handleGenderChange"
      :location-value="personalCabinetData.location"
      @update:locationValue="handleLocationChange"
      @update:birthdayDateValue="handleBirthdayDateChange"
      :birthday-date-value="birthdayDateAsDate"
    />

    <PasswordInputUI
      page="register"
      :model-value="personalCabinetData.password"
      @update:model-value="handleChangePassword"
    />

    <ButtonUI
      label="Изменить данные"
      :class="$style.changeData"
      @click="handleUpdatePersonalInformation"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTypedStore } from '../../store/index';
  import type { RegistrationData } from '../../types';
  import FormUserInformationStepTwo from '../registration/step2/RegistrationStep2.vue';
  import AvatarEditAccount from '../../ui/imageUploader/avatarEditAccount/avatarEditAccount.vue';
  import ButtonUI from '../../ui/button/Button.vue';
  import PasswordInputUI from '../../ui/password/PasswordInput.vue';

  // Router
  const router = useRouter();

  // Store
  const store = useTypedStore();

  // Селекторы
  const user = computed(() => store.getters['user/selectUser']);

  // Константы
  const genderOptions = [
    { value: 'man', label: 'Мужской' },
    { value: 'woman', label: 'Женский' },
  ];

  // Получаем данные из localStorage
  const getLocalStorageUser = (): RegistrationData | undefined => {
    const localStorageUser = localStorage.getItem('regData');
    if (localStorageUser) {
      try {
        return JSON.parse(localStorageUser);
      } catch (e) {
        console.error('Error parsing localStorage user', e);
      }
    }
    return undefined;
  };

  // Состояние
  const personalCabinetData = ref<RegistrationData>({
    email: user.value?.email || '',
    password: user.value?.password || getLocalStorageUser()?.password || '',
    name: user.value?.name || getLocalStorageUser()?.name || '',
    surname: user.value?.surname || getLocalStorageUser()?.surname || '',
    avatar: user.value?.avatar || getLocalStorageUser()?.avatar || '',
    gender: user.value?.gender || getLocalStorageUser()?.gender || '',
    location: user.value?.location || getLocalStorageUser()?.location || '',
    birthdayDate: user.value?.birthdayDate || getLocalStorageUser()?.birthdayDate || '',
  });

  // Вычисляемое свойство для преобразования строки даты в объект Date
  const birthdayDateAsDate = computed(() => {
    if (personalCabinetData.value.birthdayDate) {
      return new Date(personalCabinetData.value.birthdayDate);
    }
    return undefined;
  });

  // Наблюдаем за изменениями user
  watch(
    user,
    (newUser) => {
      if (newUser) {
        personalCabinetData.value = {
          ...personalCabinetData.value,
          email: newUser.email ?? '',
          name: newUser.name || personalCabinetData.value.name,
          surname: newUser.surname || personalCabinetData.value.surname,
          avatar: newUser.avatar || personalCabinetData.value.avatar,
          gender: newUser.gender || personalCabinetData.value.gender,
          location: newUser.location || personalCabinetData.value.location,
          birthdayDate: newUser.birthdayDate || personalCabinetData.value.birthdayDate,
        };
        console.log(personalCabinetData.value);
      }
    },
    { immediate: true }
  );

  // Обработчики
  const handleChangeName = (val: string) => {
    personalCabinetData.value = { ...personalCabinetData.value, name: val };
  };

  const handleSurnameChange = (val: string) => {
    personalCabinetData.value = { ...personalCabinetData.value, surname: val };
  };

  const handleChangeAvatar = (val: File) => {
    personalCabinetData.value = {
      ...personalCabinetData.value,
      avatar: URL.createObjectURL(val),
    };
  };

  const handleGenderChange = (val: string) => {
    personalCabinetData.value = { ...personalCabinetData.value, gender: val };
  };

  const handleLocationChange = (val: string) => {
    personalCabinetData.value = { ...personalCabinetData.value, location: val };
  };

  const handleBirthdayDateChange = (val: string) => {
    personalCabinetData.value = { ...personalCabinetData.value, birthdayDate: val };
  };

  const handleAvatar = (newImage: File) => {
    personalCabinetData.value = {
      ...personalCabinetData.value,
      avatar: URL.createObjectURL(newImage),
    };
  };

  const handleChangePassword = (password: string) => {
    personalCabinetData.value = {
      ...personalCabinetData.value,
      password: password,
    };
  };

  const handleUpdatePersonalInformation = () => {
    localStorage.setItem('regData', JSON.stringify(personalCabinetData.value));
    store.dispatch('user/changeDataInPersonalCabinet', personalCabinetData.value);
    router.go(-1);
  };

  onMounted(() => {
    console.log(user);
    console.log(birthdayDateAsDate);
  });
</script>

<style module scoped lang="css">
  .container {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    inline-size: 100%;
    block-size: fit-content;
    gap: 20px;
    padding-inline: 30px;
    padding-bottom: 30px;
  }

  .changeData {
    padding: 7px 12px;
  }

  @media (width <= 500px) {
    .container {
      margin-top: 20px;
    }
  }
</style>
