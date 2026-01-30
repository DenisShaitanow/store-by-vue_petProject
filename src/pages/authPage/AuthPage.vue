<template>
  <div :class="$style.container">
    <RegistrationHeaderUI :onClose="handleClose" />
    
    <div :class="$style.group">
        <InputUI
          v-model="email"
          title="Email"
          type="email"
          placeholder="Введите email"
          name="email"
        />
        <PasswordInputUI
          v-model="password"
          page="register"
        />
      </div>
    
    <span v-if="authError" :class="$style.authError">
      Неправильный логин или пароль.
    </span>
    
    <ButtonUI
      label="Войти"
      :onClick="onClickButton"
      :class="$style.buttonAuth"
      type="button"
      :disabled="!email || password.length < 8"
    />
  </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import RegistrationHeaderUI from '../../ui/RegistrationHeader/RegistrationHeader.vue'
    import InputUI from '../../ui/input/Input.vue'
    import ButtonUI from '../../ui/button/Button.vue'
    import PasswordInputUI from '../../ui/password/PasswordInput.vue'

    const router = useRouter()
    const store = useStore()

    const authError = ref(false)
    const email = ref('')
    const password = ref('')


    const handleClose = () => {
        router.back()
    }

    const onClickButton = () => {
        let regDataObject
        const regDataString = localStorage.getItem('regData')
        
        if (regDataString) {
            regDataObject = JSON.parse(regDataString)
        }
        
        if (email.value === regDataObject?.email && password.value === regDataObject?.password) {
            store.dispatch('loginUser', { email: email.value, password: password.value })
            router.push('/')
        } else {
            authError.value = true
        }
    }
</script>

<style module scoped>
    .container {
    display: flex;
    inline-size: 100%;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    }

    .group {
    display: flex;
    align-items: center;
    inline-size: 75%;
    align-self: center;
    flex-direction: column;
    gap: 16px;
    text-align: left;
    }

    .buttonAuth {
    height: 30px !important;
    padding-inline: 50px !important;
    margin-top: 15px;
    font-size: 14px !important;
    border-radius: 9px !important;
    }

    .authError {
    display: block;
    width: fit-content;
    height: fit-content;
    color: red;
    font-family: var(--second-family);
    font-size: var(--font-size-h3);
    font-weight: var(--font-weight-h3);
    line-height: var(--line-height-h3);
    }

    @media (width <= 700px) {
    .container {
        gap: 15px;
    }

    .authError {
        font-size: var(--font-size-h5);
    }
    }

</style>