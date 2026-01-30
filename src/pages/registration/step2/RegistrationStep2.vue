

<template>
  <form :class="$style.container" data-cy="containerFormStep2">
    <AvatarRegistration
      v-if="!hiddenAvatarInput"
      @image-change="handleFileChange"
    />
    
    <InputUI
      title="Имя"
      type="text"
      placeholder="Введите ваше имя"
      name="name"
      :value="nameValue"
      data-cy="registrationInputName"
      @update:value="$emit('update:nameValue', $event)"
    />
    
    <InputUI
      title="Фамилия"
      type="text"
      placeholder="Введите вашу фамилию"
      name="surname"
      :value="surnameValue"
      data-cy="registrationInputSurname"
      @update:value="$emit('update:surnameValue', $event)"
    />
    
    <div :class="$style.twoShortInputs">
      <InputDropDownCalendar
        :value="birthdayDateValue"
        title="Дата рождения"
        id="dateBirthday"
        placeholder="дд.мм.гггг"
        :class="$style.calendar"
        @update:value="handleChangeDate"
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
        @update:value="$emit('update:genderValue', $event)"
      />
    </div>
    
    <InputUI
      title="Город"
      type="text"
      placeholder="Введите названия вашего города"
      name="location"
      :value="locatonValue"
      data-cy="registrationInputCity"
      @update:value="$emit('update:locatonValue', $event)"
    />
  </form>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits } from 'vue'
    import AvatarRegistration from '../../../ui/imageUploader/avatarRegistration/AvatarRegistration.vue'
    import InputUI from '../../../ui/input/Input.vue'
    import InputDropDown from '../../../ui/inputDropDown/imputDropDownSimple/inputDropDown.vue'
    import InputDropDownCalendar from '../../../ui/calendar/Datapicker.vue'

    interface Option {
    value: string
    label: string
    }

    interface FormUserInformationStepTwoProps {
    hiddenAvatarInput?: boolean
    nameValue: string
    surnameValue: string
    birthdayDateValue: string
    genderValue: string
    locatonValue: string
    genderOptions: Option[]
    }

    const props = defineProps<FormUserInformationStepTwoProps>()

    const emit = defineEmits<{
    'update:nameValue': [value: string]
    'update:surnameValue': [value: string]
    'update:birthdayDateValue': [value: string]
    'update:genderValue': [value: string]
    'update:locatonValue': [value: string]
    'changeAvatarUrl': [file: File]
    }>()

    const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = input.files
    if (files && files.length > 0) {
        const selectedFile = files[0]
        emit('changeAvatarUrl', selectedFile)
        console.log(URL.createObjectURL(selectedFile))
    }
    }

    const handleChangeDate = (val: Date | null) => {
    const dateString = val ? val.toISOString().slice(0, 10) : ""
    emit('update:birthdayDateValue', dateString)
    }
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
    background-image: url("../assets/around-angle.svg") !important;
    background-repeat: no-repeat;
    background-position: center;
    transform: translateY(-50%);
    content: "";
    }

    .calendar {
    }

</style>