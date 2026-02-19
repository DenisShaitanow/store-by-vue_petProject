<template>
  <div
    :class="[
      $style.container,
      {
        [$style.container_with_button]: withEditButton,
        [$style.container_half]: halfSize,
        [$style.container_large_half]: largeSize && halfSize,
      },
    ]"
  >
    <span :class="[$style.title, $style.text]">{{ title }}</span>

    <div
      :class="[
        $style.wrapper,
        {
          [$style.wrapper_with_button]: withEditButton,
          [$style.wrapper_error]: error,
        },
      ]"
    >
      <input
        :data-cy="dataCy"
        :class="[$style.input, $style.text]"
        :type="type"
        :placeholder="placeholder"
        :name="name"
        :id="`input-${title}`"
        :value="modelValue"
        :size="halfSize ? 10 : 42"
        :readonly="withEditButton ? readonlyMode : false"
        @input="handleInput"
        ref="inputRef"
        :maxlength="maxLength"
      />

      <button
        v-if="withEditButton"
        :class="[
          $style.button,
          {
            [$style.button_visible]: withEditButton,
          },
        ]"
        type="button"
        @click="handleEditClick"
      />
    </div>

    <p v-if="error" :class="$style.text_error">{{ errorText }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, withDefaults, defineEmits, defineProps } from 'vue';

  interface Props {
    title: string;
    type: 'text' | 'email' | 'date' | 'search' | 'password';
    placeholder: string;
    name: string;
    modelValue: string;
    error?: boolean;
    errorText?: string;
    halfSize?: boolean;
    largeSize?: boolean;
    withEditButton?: boolean;
    dataCy?: string;
    maxLength?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    error: false,
    errorText: '',
    halfSize: false,
    largeSize: false,
    withEditButton: false,
    dataCy: undefined,
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string];
  }>();

  // Состояние для переключения режима readonly
  const readonlyMode = ref(true);
  const inputRef = ref<HTMLInputElement | null>(null);

  // Обработчик ввода
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  };

  // Обработчик клика по иконке редактирования
  const handleEditClick = () => {
    readonlyMode.value = !readonlyMode.value;
    if (inputRef.value) {
      inputRef.value.focus();
    }
  };
</script>

<style module scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    max-width: 436px;
    padding: 0;
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family, sans-serif);
    line-height: var(--line-height-body);
  }

  .container_with_button {
    width: 460px;
  }

  .container_half {
    width: 130px;
  }

  .container_large_half {
    width: 218px;
  }

  .text {
    inline-size: 80%;
    color: var(--text-color);
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family, sans-serif);
    line-height: var(--line-height-body);
  }

  .text_error {
    margin: 0;
    color: var(--error-color);
    font-weight: var(--font-weight-caption);
    font-size: var(--font-size-caption);
    line-height: var(--line-height-caption);
  }

  .title {
    text-align: left;
    background-color: inherit;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    padding: 11px 20px;
    border: 1px solid var(--caption-color);
    border-radius: 12px;
  }

  .wrapper_with_button {
    justify-content: space-between;
  }

  .wrapper_error {
    border-color: var(--error-color);
  }

  .input {
    text-align: left;
    background-color: inherit;
    border: none;
  }

  .input::placeholder {
    color: var(--caption-color);
  }

  .input:focus,
  .input:focus-visible {
    outline: none;
  }

  .button {
    display: none;
    justify-content: center;
    align-items: center;
    place-self: center;
    width: 24px;
    height: 24px;
    background-color: var(--surface-color);
    background-image: url('../assets/edit.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: none;
    cursor: pointer;
  }

  .button_visible {
    display: flex;
  }

  @media (400px <= width <= 500px) {
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

    .input {
      block-size: 20px;
    }
  }
</style>
