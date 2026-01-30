<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <div :class="$style.wrapper">
        <div :class="$style.group">
          <ExternalAuthButton
            :iconUrl="googleIconUrl"
            label="Продолжить с Google"
            type="button"
            @click="handleGoogleAuth"
          />
          <ExternalAuthButton
            :iconUrl="appleIconUrl"
            label="Продолжить с Apple"
            type="button"
            @click="handleAppleAuth"
          />
        </div>
        <span :class="$style.span">или</span>
        <div :class="$style.group">
          <InputUI
            title="Email"
            type="email"
            placeholder="Введите email"
            name="email"
            :value="email"
            :error="error"
            :error-text="errorText"
            data-cy="registrationInputEmail"
            @update:value="$emit('update:email', $event)"
          />
          <PasswordInputUI
            page="register"
            :value="password"
            data-cy="registrationInputPassword"
            @update:value="$emit('update:password', $event)"
          />
        </div>
      </div>
      <ButtonUI
        label="Далее"
        :class="$style.button"
        type="button"
        :disabled="!email || password.length < 8 || error"
        data-cy="buttonStep1"
        @click="$emit('click-button')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits } from 'vue'
    import ExternalAuthButton from '../../../ui/externalAuthButton/ExternalAuthButton.vue'
    import InputUI from '../../../ui/input/Input.vue'
    import ButtonUI from '../../../ui/button/Button.vue'
    import PasswordInputUI from '../../../ui/password/PasswordInput.vue'

    import googleIconUrl from '../../../ui/assets/google-icon.svg?url'
    import appleIconUrl from '../../../ui/assets/apple-icon.svg?url'

    interface PasswordStepProps {
    email: string
    password: string
    error?: boolean
    errorText?: string
    }

    const props = defineProps<PasswordStepProps>()

    const emit = defineEmits<{
    'update:email': [value: string]
    'update:password': [value: string]
    'click-button': []
    }>()

    const handleGoogleAuth = () => {
    console.log('Авторизация через учетную запись Google')
    }

    const handleAppleAuth = () => {
    console.log('Авторизация через учетную запись Apple')
    }
</script>

<style module scoped>
    .container {
    display: flex;
    justify-content: center;
    align-items: center;
    max-inline-size: 436px;
    inline-size: 75%;
    height: fit-content;
    background-color: var(--background-page-color);
    border: none;
    border-radius: 12px;
    padding-block: 30px;
    }

    .content {
    inline-size: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    margin: auto;
    }

    .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    inline-size: 100%;
    gap: 24px;
    }

    .group {
    display: flex;
    align-items: center;
    flex-direction: column;
    inline-size: 100%;
    gap: 16px;
    text-align: left;
    }

    .span {
    display: block;
    max-width: 436px;
    width: 100%;
    font-weight: var(--font-weight-body, 400);
    font-size: var(--font-size-body, 16px);
    font-family: var(--font-family, "Roboto", sans-serif);
    line-height: var(--line-height-body, 1.5);
    }

    .span::before,
    .span::after {
    content: "";
    display: inline-flex;
    width: calc((100% - 40px) / 2);
    height: 4px;
    border-top: 1px solid var(--disabled-text-color);
    }

    .span::before {
    margin-right: 4px;
    }

    .span::after {
    margin-left: 4px;
    }

    .button {
    inline-size: 30%;
    }

    @media (width <= 500px) {
    .content {
        gap: 22px;
    }

    .wrapper {
        gap: 16px;
    }
    }
</style>