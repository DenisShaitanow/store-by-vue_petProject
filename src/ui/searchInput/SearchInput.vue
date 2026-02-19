<template>
  <div :class="wrapperClasses">
    <div :class="$style.search" @focus="handleFocus">
      <SearchSvg :class="$style.search__icon" />
      <input
        ref="inputRef"
        type="text"
        :placeholder="placeholder"
        :value="value"
        @input="handleInputChange"
        @keydown="onInputKeyDown"
        :class="$style.search__input"
        :aria-autocomplete="'list'"
        :aria-expanded="isDropdownVisible"
        aria-haspopup="listbox"
        :aria-controls="listboxId"
        :aria-activedescendant="
          activeIdx >= 0 ? `${idBase}-option-${filteredOptions[activeIdx].id}` : undefined
        "
        role="combobox"
      />
      <button
        v-if="value"
        type="button"
        aria-label="Очистить"
        @click="handleClear"
        :class="$style.iconButton"
      >
        <CrossSvg :class="$style.search__clear" />
      </button>
    </div>

    <ul
      v-if="isDropdownVisible"
      :id="listboxId"
      :class="$style.dropdown"
      role="listbox"
      ref="listRef"
    >
      <template v-if="!showEmpty">
        <li v-for="(option, idx) in filteredOptions" :key="option.id" role="presentation">
          <button
            type="button"
            :id="`${idBase}-option-${option.id}`"
            role="option"
            :aria-selected="idx === activeIdx"
            :data-idx="idx"
            :class="$style.dropdownItem"
            @mousedown.prevent
            @click="() => handleSelect(option)"
            @keydown="(e) => onOptionKeyDown(e, idx)"
            :ref="(el) => setOptionRef(idx, el as HTMLButtonElement)"
          >
            {{ option.label }}
          </button>
        </li>
      </template>
      <li v-if="showEmpty" :class="$style.dropdownEmpty">Не найдено</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    watch,
    withDefaults,
    defineProps,
    defineEmits,
  } from 'vue';
  import SearchSvg from '../assets/search.svg';
  import CrossSvg from '../assets/cross.svg';

  // Интерфейсы
  export interface SkillOption {
    id: string;
    label: string;
  }

  interface Props {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSelect?: (option: SkillOption) => void;
    options?: SkillOption[];
    className?: string;
    limit?: number;
    caseSensitive?: boolean;
    filter?: (option: SkillOption, input: string) => boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Искать навык',
    options: () => [],
    className: '',
    limit: 10,
    caseSensitive: false,
    filter: undefined,
  });

  const emit = defineEmits<{
    'update:value': [value: string];
    change: [value: string];
    select: [option: SkillOption];
  }>();

  // Рефы
  const inputRef = ref<HTMLInputElement>();
  const listRef = ref<HTMLUListElement>();
  const optionRefs = ref<(HTMLButtonElement | null)[]>([]);

  // Состояния
  const isOpen = ref(false);
  const activeIdx = ref<number>(-1);
  const idBase = ref(`search-${Math.random().toString(36).substr(2, 9)}`);

  // Вычисляемые свойства
  const norm = (s: string) => (props.caseSensitive ? s : s.toLowerCase());

  const defaultFilter = (opt: SkillOption, input: string) =>
    norm(opt.label).startsWith(norm(input));

  const effectiveFilter = computed(() => props.filter ?? defaultFilter);

  const filteredOptions = computed(() => {
    if (!props.value) return props.options.slice(0, props.limit);
    const res = props.options.filter((o) => effectiveFilter.value(o, props.value));
    return res.slice(0, props.limit);
  });

  const isDropdownVisible = computed(
    () => isOpen.value && (filteredOptions.value.length > 0 || !!props.value)
  );

  const showEmpty = computed(() => !!props.value && filteredOptions.value.length === 0);

  const listboxId = computed(() => `${idBase.value}-listbox`);

  const wrapperClasses = computed(() => {
    const classes = [$style.searchWrapper];
    if (props.className) classes.push(props.className);
    return classes;
  });

  // Методы
  const setOptionRef = (idx: number, el: HTMLButtonElement) => {
    optionRefs.value[idx] = el;
  };

  const focusOption = (idx: number) => {
    const btn = optionRefs.value[idx];
    btn?.focus();
  };

  const handleSelect = (option: SkillOption) => {
    emit('update:value', option.label);
    emit('change', option.label);
    emit('select', option);
    isOpen.value = false;
    activeIdx.value = -1;
    requestAnimationFrame(() => inputRef.value?.focus());
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit('update:value', target.value);
    emit('change', target.value);
    isOpen.value = true;
    activeIdx.value = -1;
  };

  const handleFocus = () => {
    isOpen.value = true;
  };

  const handleClear = () => {
    emit('update:value', '');
    emit('change', '');
    isOpen.value = true;
    activeIdx.value = -1;
    inputRef.value?.focus();
  };

  const onInputKeyDown = (e: KeyboardEvent) => {
    if (!isDropdownVisible.value) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (filteredOptions.value.length) {
          isOpen.value = true;
          const next =
            activeIdx.value >= 0
              ? Math.min(activeIdx.value + 1, filteredOptions.value.length - 1)
              : 0;
          activeIdx.value = next;
          requestAnimationFrame(() => focusOption(next));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (filteredOptions.value.length) {
          const prev =
            activeIdx.value >= 0
              ? Math.max(activeIdx.value - 1, 0)
              : filteredOptions.value.length - 1;
          isOpen.value = true;
          activeIdx.value = prev;
          requestAnimationFrame(() => focusOption(prev));
        }
        break;

      case 'Enter':
        if (activeIdx.value >= 0 && activeIdx.value < filteredOptions.value.length) {
          e.preventDefault();
          handleSelect(filteredOptions.value[activeIdx.value]);
        } else if (props.value.trim()) {
          emit('select', { id: props.value, label: props.value });
          isOpen.value = false;
        }
        break;

      case 'Escape':
        e.preventDefault();
        isOpen.value = false;
        activeIdx.value = -1;
        break;

      case 'Tab':
        isOpen.value = false;
        activeIdx.value = -1;
        break;
    }
  };

  const onOptionKeyDown = (e: KeyboardEvent, idx: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const next = Math.min(idx + 1, filteredOptions.value.length - 1);
        if (next !== idx) {
          activeIdx.value = next;
          requestAnimationFrame(() => focusOption(next));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (idx > 0) {
          const prev = idx - 1;
          activeIdx.value = prev;
          requestAnimationFrame(() => focusOption(prev));
        } else {
          activeIdx.value = -1;
          inputRef.value?.focus();
        }
        break;

      case 'Enter':
        e.preventDefault();
        handleSelect(filteredOptions.value[idx]);
        break;

      case 'Escape':
        e.preventDefault();
        isOpen.value = false;
        activeIdx.value = -1;
        inputRef.value?.focus();
        break;

      case 'Tab':
        isOpen.value = false;
        activeIdx.value = -1;
        break;
    }
  };

  const handleClickOutside = (e: PointerEvent) => {
    const target = e.target as Node;
    if (!inputRef.value?.contains(target) && !listRef.value?.contains(target)) {
      isOpen.value = false;
      activeIdx.value = -1;
    }
  };

  // Хуки жизненного цикла
  onMounted(() => {
    document.addEventListener('pointerdown', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('pointerdown', handleClickOutside);
  });

  // Наблюдатели
  watch(activeIdx, (newIdx) => {
    if (newIdx < 0 || !listRef.value) return;
    const el = listRef.value.querySelector<HTMLElement>(`[data-idx="${newIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  });
</script>

<style module scoped>
  .search {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 48px;
    padding: 12px;
    background-color: var(--surface-color);
    border-radius: 12px;
    transition: border-radius 0.2s ease;
  }

  .search.search_open {
    border-radius: 12px 12px 0 0;
  }

  .search__input {
    width: 100%;
    color: var(--caption-color);
    font-size: 16px;
    font-family: var(--font-family), serif;
    line-height: 1.5;
    background: transparent;
    border: none;
    outline: none;
  }

  .search__input:focus {
    color: var(--text-color);
  }

  .search__input::placeholder {
    color: var(--caption-color);
    opacity: 1;
  }

  .search__icon {
    z-index: 1;
    width: 24px;
    height: 24px;
    color: var(--caption-color);
  }

  .search__clear {
    width: 24px;
    height: 24px;
    color: var(--text-color);
    cursor: pointer;
  }

  .search__clear:hover {
    opacity: 0.7;
  }

  .dropdown {
    position: absolute;
    z-index: 10;
    width: 100%;
    max-height: 130px;
    padding: 8px 0;
    overflow-y: auto;
    background: var(--surface-color);
    border-radius: 0 0 12px 12px;
  }

  .dropdown::-webkit-scrollbar {
    width: 4px;
  }

  .dropdown::-webkit-scrollbar-track {
    margin: 8px 0;
    background: transparent;
  }

  .dropdown::-webkit-scrollbar-thumb {
    background: var(--disabled-bg-color);
    border-radius: 2px;
  }

  .dropdown li {
    list-style: none;
  }

  .dropdownItem {
    width: 100%;
    padding: 8px 42px;
    overflow: hidden;
    color: var(--text-color);
    font-size: 16px;
    font-family: var(--font-family);
    white-space: nowrap;
    text-align: left;
    text-overflow: ellipsis;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .dropdownItem:hover {
    background-color: var(--disabled-bg-color);
  }

  .dropdownEmpty {
    padding: 8px 20px;
    color: var(--caption-color);
    font-style: italic;
  }

  .searchWrapper {
    position: relative;
    width: 100%;
  }

  .iconButton {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    background: transparent;
    border: none;
  }
</style>
