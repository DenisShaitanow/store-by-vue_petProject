<template>
  <div 
    :class="[
      $style.container,
      { [$style.container_large]: largeSize }
    ]"
  >
    <span :class="[$style.title, $style.text]">Пароль</span>
    
    <div 
      :class="[
        $style.wrapper,
        { 
          [$style.wrapper_error]: shouldShowError 
        }
      ]"
    >
      <input
        :data-cy="dataCy"
        autocomplete="off"
        :class="[$style.input, $style.text]"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholderText"
        name="password"
        :id="inputId"
        @input="handleInput"
        :value="modelValue"
        maxlength="50"
        size="42"
      />
      
      <RevealElementUI
        @click="toggleInputVisibility"
        :visible="showPassword"
      />
    </div>
    
    <p 
      v-if="isRegisterPage"
      :class="[
        $style.text_tip,
        { [$style.text_error]: passwordIsTooShort || modelValue.length === 0 }
      ]"
    >
      {{ passwordHint }}
    </p>
    
    <p 
      v-else-if="error && isLoginPage"
      :class="[$style.text, $style.text_tip, $style.text_error]"
    >
      {{ errorText }}
    </p>
  </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import RevealElement from './PasswordReveal.vue'

    const props = defineProps({
        page: {
            type: String,
            required: true,
            validator: (value) => ['register', 'login'].includes(value)
        },
        modelValue: {
            type: String,
            default: ''
        },
        error: {
            type: Boolean,
            default: false
        },
        errorText: {
            type: String,
            default: ''
        },
        dataCy: {
            type: String,
            default: ''
        },
        largeSize: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['update:modelValue'])

    // Реактивное состояние для видимости пароля
    const showPassword = ref(false)

    // Вычисляемые свойства
    const isRegisterPage = computed(() => props.page === 'register')
    const isLoginPage = computed(() => props.page === 'login')
    const passwordIsTooShort = computed(() => 
    props.modelValue.length > 0 && props.modelValue.length < 8
    )

    const shouldShowError = computed(() => {
    if (isRegisterPage.value && passwordIsTooShort.value) return true
    if (isLoginPage.value && props.error) return true
    return false
    })

    const placeholderText = computed(() => 
    isRegisterPage.value 
        ? 'Придумайте надежный пароль' 
        : 'Введите ваш пароль'
    )

    const inputId = computed(() => `input-password`)

    const passwordHint = computed(() => 
    passwordIsTooShort.value || props.modelValue.length === 0
        ? 'Пароль должен состоять не менее, чем из 8 символов'
        : 'Надежный'
    )

    // Методы
    const toggleInputVisibility = () => {
    showPassword.value = !showPassword.value
    }

    const handleInput = (event) => {
    emit('update:modelValue', event.target.value)
    }
</script>

<style module scoped>
    .container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    max-width: 436px;
    padding: 0;
    }

    .container_large {
    width: 460px;
    }

    .text {
    color: var(--text-color);
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family, sans-serif);
    line-height: var(--line-height-body);
    }

    .text_tip {
    margin: 0;
    margin-left: 7px;
    font-weight: var(--font-weight-caption);
    font-size: var(--font-size-caption);
    line-height: var(--line-height-caption);
    color: var(--text-color);
    }

    .text_error {
    color: var(--error-color);
    }

    .title {
    text-align: left;
    background-color: var(--background-page-color);
    }

    .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 11px 20px;
    border: 1px solid var(--caption-color);
    border-radius: 12px;
    }

    .wrapper_error {
    border-color: var(--error-color);
    }

    .input {
    inline-size: 80%;
    text-align: left;
    border: none;
    color: var(--text-color);
    background-color: inherit;
    }

    .input::placeholder {
    color: var(--caption-color);
    }

    .input:focus,
    .input:focus-visible {
    outline: none;
    }

    @media (width <= 500px) {
    .text {
        font-size: 12px;
    }

    .input {
        block-size: 20px;
    }
    }

    @media (width <= 399px) {
    .text {
        font-size: 10px;
    }
    }
</style>