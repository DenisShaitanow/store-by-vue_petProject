<template>
  <div ref="containerRef" :class="[$style.container, props.className]">
    <label :class="$style.label" :for="props.id">
      {{ title }}
    </label>

    <div :class="{ [$style.borderDone]: isOpen }">
      <div
        data-cy="inputDroppdownSelect"
        :class="[
          $style.select,
          {
            [$style.selectOpen]: isOpen,
            [classNameImageOpen]: isOpen && classNameImageOpen,
          },
        ]"
        @click="toggleDropdown"
      >
        {{ selectedLabel || placeholder }}

        <KrestClose v-if="isOpen" :class="$style.svg" @click.stop="handleCloseClick" />
        <AngleOpen v-else :class="$style.svg" @click.stop="handleOpenClick" />
      </div>

      <div
        v-if="isOpen"
        :class="[$style.optionsContainer, { [$style.optionsContainerOpen]: isOpen }]"
      >
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          :data-cy="`genderOption${index}`"
          :class="$style.option"
          @click="handleOptionClick(option.value)"
          role="menuitem"
          tabindex="0"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <span v-if="error" :class="$style.error">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';
  import AngleOpen from '../../assets/angleOpenInput.svg';
  import KrestClose from '../../assets/krestCloseInput.svg';

  // Определяем пропсы
  interface Props {
    options: { value: string; label: string }[];
    withInput: boolean;
    className?: string;
    classNameImageOpen?: string;
    id: string;
    title: string;
    value?: string;
    placeholder: string;
    error?: string;
    dataCy?: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

  // Рефы
  const containerRef = ref<HTMLDivElement>();
  const inputRef = ref<HTMLInputElement>();

  // Состояния
  const isOpen = ref(false);
  const searchTerm = ref('');
  const selectedValue = ref(props.value || '');
  const selectedLabel = ref('');
  const filteredOptions = ref(props.options);

  // Вычисляемые свойства
  const inputValue = computed(() => {
    return searchTerm.value || selectedLabel.value;
  });

  // Методы
  const findLabelByValue = (options: { value: string; label: string }[], value: string) => {
    const foundOption = options.find((opt) => opt.value === value);
    return foundOption?.label || '';
  };

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value && props.withInput && inputRef.value) {
      inputRef.value.focus();
    }
  };

  const handleOptionClick = (optionValue: string) => {
    const fakeEvent = {
      target: {
        name: props.id,
        value: optionValue,
      },
    };
    emit('update:modelValue', optionValue);
    selectedValue.value = optionValue;
    selectedLabel.value = findLabelByValue(props.options, optionValue);
    searchTerm.value = '';
    isOpen.value = false;
  };

  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newSearchTerm = target.value.trim().toLowerCase();
    searchTerm.value = newSearchTerm;

    // Фильтруем варианты по введённой строке
    filteredOptions.value = props.options.filter((opt) =>
      opt.label.toLowerCase().startsWith(newSearchTerm)
    );

    if (newSearchTerm === '') {
      isOpen.value = false;
    } else {
      isOpen.value = true;
    }
  };

  const handleInputFocus = () => {
    isOpen.value = true;
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      isOpen.value = false;
    }, 100);
  };

  const handleCloseClick = () => {
    isOpen.value = false;
  };

  const handleOpenClick = () => {
    isOpen.value = true;
    if (props.withInput && inputRef.value) {
      inputRef.value.focus();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
      isOpen.value = false;
    }
  };

  // Хуки жизненного цикла
  onMounted(() => {
    // Устанавливаем начальное значение
    if (props.value) {
      selectedLabel.value = findLabelByValue(props.options, props.value);
    }

    // Добавляем обработчик клика вне компонента
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    // Убираем обработчик клика вне компонента
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style module scoped>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    color: var(--text-color);
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family, sans-serif);
    line-height: var(--line-height-body);
  }

  /* Selector */

  .select {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 48px;
    padding: 11px 20px;
    background-color: var(--color-bg);
    border: 1px solid var(--caption-color);
    border-radius: var(--card-border-radius);
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  /* Styles when there is an error */

  .selectError {
    color: var(--error-color);
    border-color: var(--error-color);
  }

  /* Open state */

  .borderDone {
    top: 28px;
    z-index: 800;
    width: 100%;
    border-radius: var(--card-border-radius);
  }

  /* Opened selector with error */

  .selectOpenError {
    border-bottom: 1px solid var(--error-color);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  /* Icon for open state */

  .svg {
    width: 16px;
    height: 16px;
    stroke: var(--text-color);
    fill: var(--text-color);
  }

  /* Placeholder selection */

  .selectHasPlaceholder {
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family, sans-serif);
    line-height: var(--line-height-body);
  }

  /* Error message */

  .error {
    margin-top: 4px;
    color: var(--color-error);
  }

  .input {
    width: 100%;
    height: 100%;
    color: var(--text-color);
    color: var(--text-color);
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family, sans-serif);
    line-height: var(--line-height-body);
    border: transparent;
    background-color: inherit;
  }

  /* Container for options */

  .optionsContainer {
    position: absolute;
    left: 0;
    margin-top: 1px;
    z-index: 1;
    width: 100%;
    max-height: 110px;
    overflow-y: auto;
    border: solid 1px var(--caption-color);
    background-color: var(--background-page-color);
  }

  .optionsContainer::-webkit-scrollbar {
    width: 10px;
  }

  .optionsContainer::-webkit-scrollbar-thumb {
    width: 4px;
    background-color: #e4e8df;
    border-radius: 5px;
  }

  .optionsContainer::-webkit-scrollbar-track {
    margin-right: 15px;
    margin-bottom: 10px;
    background-color: #ffffff;
  }

  .optionsContainerOpen {
    border-radius: var(--card-border-radius);
  }

  /* Individual options */

  .option {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 10;
    width: 100%;
    height: 32px;
    padding: 4px 20px;
    border-radius: 1px solid var(--background-page-color);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  /* Hover effect for options */

  .option:hover {
    background-color: var(--button-hover-color);
  }

  /* Highlight active option */

  .selected {
    background-color: var(--button-hover-color);
  }

  .label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 24px;
    width: 100%;
  }

  @media (400px <= width <= 500px) {
    .container {
      font-size: 12px;
    }

    .svg {
      width: 14px;
      height: 14px;
    }
  }

  @media (width <= 399px) {
    .container {
      font-size: 10px;
    }

    .select {
      min-height: 43px;
    }

    .svg {
      width: 13px;
      height: 13px;
    }
  }
</style>
