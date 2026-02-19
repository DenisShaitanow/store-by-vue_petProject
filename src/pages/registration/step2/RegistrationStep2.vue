<template>
  <form :class="$style.container" data-cy="containerFormStep2">
    <AvatarRegistration v-if="!hiddenAvatarInput" @image-change="handleFileChange" />

    <InputUI
      title="Имя"
      type="text"
      placeholder="Введите ваше имя"
      name="name"
      :model-value="nameValue"
      data-cy="registrationInputName"
      @update:model-value="$emit('update:nameValue', $event)"
    />

    <InputUI
      title="Фамилия"
      type="text"
      placeholder="Введите вашу фамилию"
      name="surname"
      :model-value="surnameValue"
      data-cy="registrationInputSurname"
      @update:model-value="$emit('update:surnameValue', $event)"
    />

    <div :class="$style.twoShortInputs">
      <InputDropDownCalendar
        :value="birthdayDateValue"
        :title="'Дата рождения'"
        :id="'dateBirthday'"
        :placeholder="'дд.мм.гггг'"
        @update:model-value="handleChangeDate"
      />

      <InputDropDown
        :options="genderOptions"
        :with-input="false"
        id="gender"
        placeholder="Не указан"
        title="Пол"
        :value="genderValue"
        :class-image-open="$style.aroundImage"
        data-cy="registrationInputGender"
        @update:model-value="$emit('update:genderValue', $event)"
      />
    </div>

    <InputUI
      title="Город"
      type="text"
      placeholder="Введите названия вашего города"
      name="location"
      :model-value="locationValue"
      data-cy="registrationInputCity"
      @update:model-value="$emit('update:locationValue', $event)"
    />
  </form>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, onMounted } from 'vue';
  import AvatarRegistration from '../../../ui/imageUploader/avatarRegistration/AvatarRegistration.vue';
  import InputUI from '../../../ui/input/Input.vue';
  import InputDropDown from '../../../ui/inputDropDown/imputDropDownSimple/inputDropDown.vue';
  import InputDropDownCalendar from '../../../ui/inputDropDown/inputDropDownCalendar/inputDropDownCalendar.vue';

  interface Option {
    value: string;
    label: string;
  }

  interface FormUserInformationStepTwoProps {
    hiddenAvatarInput?: boolean;
    nameValue: string;
    surnameValue: string;
    birthdayDateValue: string;
    genderValue: string;
    locationValue: string;
    genderOptions: Option[];
  }

  const props = defineProps<FormUserInformationStepTwoProps>();

  const emit = defineEmits<{
    'update:nameValue': [value: string];
    'update:surnameValue': [value: string];
    'update:birthdayDateValue': [value: string];
    'update:genderValue': [value: string];
    'update:locationValue': [value: string];
    changeAvatarUrl: [file: File];
  }>();

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      emit('changeAvatarUrl', selectedFile);
      console.log(URL.createObjectURL(selectedFile));
    }
  };

  const handleChangeDate = (val: Date | null) => {
    const dateString = val ? val.toISOString().slice(0, 10) : '';
    emit('update:birthdayDateValue', dateString);
  };
</script>

<style module scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    max-width: 436px;
    height: fit-content;
  }

  .twoShortInputs {
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 436px;
    height: 76px;
  }

  .shortInput {
    width: 208px !important;
  }

  .aroundImage::after {
    position: absolute;
    top: 50%;
    right: 1rem;
    width: 16px !important;
    height: 8px !important;
    background-image: url('../assets/around-angle.svg') !important;
    background-repeat: no-repeat;
    background-position: center;
    transform: translateY(-50%);
    content: '';
  }
</style>
