<script setup lang="ts">
    import { ref, computed, toRefs, withDefaults, defineProps } from 'vue';
    import { CheckboxOption, CheckboxDropdownProps } from './types';
    import CheckboxGroupUI from '../checkbox/CheckboxGroupUI.vue';
    import BaseDropdown from '../baseDropdown/BaseDropdown.vue';
    import SearchInput from '../searchInput/SearchInput.vue';
    import ExpandableList from '../expandableList/ExpandableList.vue';
    
    // Пропсы с дефолтами
    const props = withDefaults(
      defineProps<CheckboxDropdownProps>(),
      {
        placeholder: 'Выберите опции',
        enableSearch: false,
        searchPlaceholder: 'Поиск...',
        treeMode: false,
        maxVisibleOptions: 3,
        showAllText: 'Показать все',
        collapseText: 'Свернуть',
        staticMode: false,
        disabled: false,
        closeOnClickOutside: true,
        closeOnEscape: true,
      }
    );
    
    const { selectedValues, defaultSelectedValues, options } = toRefs(props);
    
    // Локальное состояние (для uncontrolled режима)
    const internalSelectedValues = ref<(string | number)[]>(
      defaultSelectedValues.value ?? []
    );
    const searchQuery = ref('');
    const isOpen = ref(false);
    const expandedCategories = ref<Set<string | number>>(new Set());
    
    // Выбранные значения: controlled или internal
    const selectedValuesComputed = computed(() =>
      selectedValues.value ?? internalSelectedValues.value
    );
    
    // Нормализация опций: строки → CheckboxOption
    const normalizedOptions = computed((): CheckboxOption[] =>
      options.value.map((option, index) => {
        if (typeof option === 'string') {
          return { value: index, label: option };
        }
        return option;
      })
    );
    
    // Получение всех потомков для древовидной структуры
    const getAllChildren = (option: CheckboxOption): (string | number)[] =>
      option.children ? option.children.flatMap(getAllChildren) : [option.value];
    
    // Фильтрация по поиску
    const filteredOptions = computed(() => {
      if (!props.enableSearch || !searchQuery.value.trim()) return normalizedOptions.value;
      const query = searchQuery.value.toLowerCase().trim();
      return normalizedOptions.value.filter((option) =>
        option.label.toLowerCase().includes(query)
      );
    });
    
    // Переключение раскрытия категории
    const toggleCategory = (categoryValue: string | number) => {
      const next = new Set(expandedCategories.value);
      next.has(categoryValue)
        ? next.delete(categoryValue)
        : next.add(categoryValue);
      expandedCategories.value = next;
    };
    
    // Состояние чекбокса для древовидной структуры
    const getCheckboxState = (option: CheckboxOption) => {
      if (!props.treeMode || !option.children) {
        return selectedValuesComputed.value.includes(option.value)
          ? 'checked'
          : 'unchecked';
      }
    
      const childValues = getAllChildren(option);
      const selectedCount = childValues.filter((v) =>
        selectedValuesComputed.value.includes(v)
      ).length;
    
      return selectedCount === 0
        ? 'unchecked'
        : selectedCount === childValues.length
          ? 'checked'
          : 'indeterminate';
    };
    
    // Обработчик изменения чекбоксов (простой режим)
    const handleCheckboxChange = (newValue: boolean, label: string) => {
      const option = filteredOptions.value.find((opt) => opt.label === label);
      if (!option) return;
    
      const newSelected = newValue
        ? [...selectedValuesComputed.value, option.value]
        : selectedValuesComputed.value.filter((v) => v !== option.value);
    
      if (selectedValues.value === undefined) {
        internalSelectedValues.value = newSelected;
      }
      props.onChange?.(newSelected);
    };
    
    // Обработчик для древовидной структуры
    const handleTreeOptionToggle = (option: CheckboxOption) => {
      const newSelected = props.treeMode && option.children
        ? (() => {
            const childValues = getAllChildren(option);
            const allSelected = childValues.every((v) =>
              selectedValuesComputed.value.includes(v)
            );
            return allSelected
              ? selectedValuesComputed.value.filter((v) => !childValues.includes(v))
              : [...new Set([...selectedValuesComputed.value, ...childValues])];
          })()
        : selectedValuesComputed.value.includes(option.value)
          ? selectedValuesComputed.value.filter((value) => value !== option.value)
          : [...selectedValuesComputed.value, option.value];
    
      if (selectedValues.value === undefined) {
        internalSelectedValues.value = newSelected;
      }
      props.onChange?.(newSelected);
    };
    
    // Рендеринг одной опции древовидной структуры
    const renderTreeOption = (option: CheckboxOption, level: number) => (
      <div key={option.value}>
        <div
          class={[
            $style.optionRow,
            level > 0 && $style.optionRow_child,
            option.children?.length && $style.optionRow_hasChildren,
            expandedCategories.value.has(option.value) && $style.optionRow_expanded,
          ]}
        >
          <div class={$style.checkboxContainer}>
            <input
              id={`checkbox-${option.value}-${level}`}
              type="checkbox"
              class={$style.checkboxInput}
              checked={getCheckboxState(option) === 'checked'}
              ref={(el: HTMLInputElement | null) => {
                if (el) el.indeterminate = getCheckboxState(option) === 'indeterminate';
              }}
              disabled={props.disabled || option.disabled}
              onChange={() => !props.disabled && handleTreeOptionToggle(option)}
              onClick={(e: MouseEvent) => e.stopPropagation()}
            />
            <label
              htmlFor={`checkbox-${option.value}-${level}`}
              class={[
                $style.checkboxIcon,
                getCheckboxState(option) === 'indeterminate' && $style.checkboxIcon_indeterminate,
              ]}
            />
          </div>
    
          <div
            class={[
              $style.labelContainer,
              (props.disabled || option.disabled) && $style.labelContainer_disabled,
              (!props.disabled && !option.disabled) && $style.labelContainer_clickable,
            ]}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              if (!props.disabled && !option.disabled) {
                if (option.children?.length) {
                  toggleCategory(option.value);
                } else {
                  handleTreeOptionToggle(option);
                }
              }
            }}
          >
            <span class={$style.checkboxText}>{option.label}</span>
          </div>
    
          {option.children?.length && (
            <div
              class={[
                $style.expandArrow,
                expandedCategories.value.has(option.value) && $style.expandArrow_expanded,
              ]}
            />
          )}
        </div>
    
        {option.children?.length && (
          <div
            class={[
              $style.childrenContainer,
              expandedCategories.value.has(option.value) && $style.childrenContainer_expanded,
            ]}
          >
            {option.children!.map((child) => renderTreeOption(child, level + 1))}
          </div>
        )}
      </div>
    );
    </script>
    
    <template>
      <div
        :class="[
          $style.staticContainer,
          props.className,
          props.staticMode && $style.staticMode,
        ]"
      >
        <h3 v-if="props.title" :class="$style.staticTitle">{{ props.title }}</h3>
    
        <div :class="$style.content">
          <!-- Поиск -->
          <div v-if="props.enableSearch" :class="$style.searchContainer">
            <SearchInput
              v-model="searchQuery"
              :placeholder="props.searchPlaceholder"
              :class="$style.searchInput"
            />
          </div>

          <div :class="$style.optionsList">
        <!-- Нет результатов поиска или опций -->
        <div v-if="filteredOptions.length === 0" :class="$style.noOptions">
          {{ props.enableSearch && searchQuery.value ? 'Ничего не найдено' : 'Нет доступных опций' }}
        </div>

        <!-- Древовидный режим -->
        <div
          v-else-if="props.treeMode"
          :class="$style.treeContainer"
        >
          <ExpandableList
            :maxVisibleItems="props.maxVisibleOptions"
            :showAllText="props.showAllText"
            :collapseText="props.collapseText"
            :additionalItemsClassName="$style.additionalOptions"
            :additionalItemsExpandedClassName="$style.additionalOptions_show"
            :buttonClassName="$style.showAllButton"
          >
            <template
              v-for="option in filteredOptions"
              :key="option.value"
            >
              {{ renderTreeOption(option, 0) }}
            </template>
          </ExpandableList>
        </div>

        <!-- Простой режим (список чекбоксов) -->
        <ExpandableList
          v-else
          :maxVisibleItems="props.maxVisibleOptions"
          :showAllText="props.showAllText"
          :collapseText="props.collapseText"
          :additionalItemsClassName="$style.additionalOptions"
          :additionalItemsExpandedClassName="$style.additionalOptions_show"
          :buttonClassName="$style.showAllButton"
        >
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            :class="$style.option"
          >
            <CheckboxGroupUI
              :fieldNames="[option.label]"
              :selectedItems="
                selectedValuesComputed.value.includes(option.value)
                  ? [option.label]
                  : []
              "
              @change="handleCheckboxChange"
              :withInDropdown="!props.staticMode"
            />
          </div>
        </ExpandableList>
      </div>
    </div>
  </div>

  <!-- Обычный режим с выпадашкой (не staticMode) -->
  <BaseDropdown
    v-if="!props.staticMode"
    :trigger="
      <div
        :class="[
          $style.trigger,
          props.triggerClassName,
          props.disabled && $style.trigger_disabled,
          isOpen && $style.trigger_open,
          selectedValuesComputed.value.length > 0 && $style.trigger_has_selection,
        ]"
      >
        <span :class="$style.triggerText">
          {{
            selectedValuesComputed.value.length > 0
              ? selectedValuesComputed.value
                .map(val => {
                  const opt = normalizedOptions.value.find(o => o.value === val);
                  return opt ? opt.label : val;
                })
                .join(', ')
              : props.placeholder
          }}
        </span>
        <svg
          :class="[
            $style.chevron,
            isOpen && $style.chevron_open
          ]"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    "
    v-model:isOpen="isOpen"
    :placement="props.placement"
    :offset="props.offset"
    :closeOnClickOutside="props.closeOnClickOutside"
    :closeOnEscape="props.closeOnEscape"
    :disabled="props.disabled"
    :class="[props.className, $style.dropdownWrapper]"
    :dropdownClassName="$style.dropdown"
    :aria-label="props['aria-label'] || 'Выпадающий список с множественным выбором'"
  >
    <div :class="$style.content">
      <div v-if="props.enableSearch" :class="$style.searchContainer">
        <SearchInput
          v-model="searchQuery"
          :placeholder="props.searchPlaceholder"
          :class="$style.searchInput"
        />
      </div>

      <div :class="$style.optionsList">
        <div v-if="filteredOptions.length === 0" :class="$style.noOptions">
          {{ props.enableSearch && searchQuery.value ? 'Ничего не найдено' : 'Нет доступных опций' }}
        </div>

        <div v-else-if="props.treeMode" :class="$style.treeContainer">
          <ExpandableList
            :maxVisibleItems="props.maxVisibleOptions"
            :showAllText="props.showAllText"
            :collapseText="props.collapseText"
            :additionalItemsClassName="$style.additionalOptions"
            :additionalItemsExpandedClassName="$style.additionalOptions_show"
            :buttonClassName="$style.showAllButton"
          >
            <template
              v-for="option in filteredOptions"
              :key="option.value"
            >
              {{ renderTreeOption(option, 0) }}
            </template>
          </ExpandableList>
        </div>

        <ExpandableList
          v-else
          :maxVisibleItems="props.maxVisibleOptions"
          :showAllText="props.showAllText"
          :collapseText="props.collapseText"
          :additionalItemsClassName="$style.additionalOptions"
          :additionalItemsExpandedClassName="$style.additionalOptions_show"
          :buttonClassName="$style.showAllButton"
        >
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            :class="$style.option"
          >
            <CheckboxGroupUI
              :fieldNames="[option.label]"
              :selectedItems="
                selectedValuesComputed.value.includes(option.value)
                  ? [option.label]
                  : []
              "
              @change="handleCheckboxChange"
              :withInDropdown="true"
            />
          </div>
        </ExpandableList>
      </div>
    </div>
  </BaseDropdown>
</template>

<style module>

    /* Статичный контейнер для фильтров */

.staticContainer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.staticTitle {
  margin: 0;
  color: var(--text-color);
  font-weight: var(--font-weight-h3);
  font-size: var(--font-size-h3);
  font-family: var(--second-family);
  line-height: var(--line-height-h3);
}

/* Trigger элемент */

.trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 200px;
  height: 40px;
  padding: 8px 12px;
  color: var(--text-color);
  font-weight: 400;
  font-size: 16px;
  font-family: "Roboto", var(--font-family, sans-serif);
  line-height: 1.5;
  letter-spacing: 0.02em;
  background-color: var(--surface-color);
  border: 1px solid var(--dropdown-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.trigger:hover {
  background-color: var(--button-hover-color);
  border-color: var(--accent-color);
}

.trigger_open {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgb(171 210 122 / 20%);
}

.trigger_disabled {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}

.trigger_has_selection {
  color: var(--text-color);
}

.triggerText {
  flex: 1;
  overflow: hidden;
  color: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Chevron иконка */

.chevron {
  flex-shrink: 0;
  color: var(--caption-color);
  transition: transform 0.2s ease-in-out;
}

.chevron_open {
  transform: rotate(180deg);
}

/* Dropdown контент */

.dropdown {
  min-width: 280px;
}

.content {
  max-height: 300px;
  overflow-y: auto;
}

/* Контейнер поиска */

.searchContainer {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--dropdown-border);
}

/* Список опций */

.optionsList {
  display: flex;
  flex-direction: column;
  gap: var(--card-small-tag-gap);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.optionsList > div {
  margin-bottom: 0 !important;
}

/* Контейнер древовидной структуры */

.treeContainer {
  padding: 0;
}

/* Отступы между категориями и подкатегориями */

.content > div > div[class*="list"] {
  gap: var(--card-small-tag-gap);
}

/* Плавное появление дополнительных элементов */

.additionalOptions {
  max-height: 0;
  overflow: hidden;
  transform: translateY(-8px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.additionalOptions_show {
  max-height: 400px;
  transform: translateY(0);
  opacity: 1;
}

/* Строки опций для древовидной структуры */

.optionRow {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  margin-bottom: 12px;
  padding: 8px 12px;
  transition: background-color 0.2s ease-in-out;
}

/* Убираем отступ у последней категории */

.optionRow:last-child {
  margin-bottom: 0;
}

.optionRow_child {
  padding-left: 32px;
}

.optionRow_hasChildren {
  cursor: pointer;
}

.optionRow_hasChildren:hover {
  background-color: #f8f9fa;
}

/* Контейнер чекбокса */

.checkboxContainer {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin-right: 8px;
}

/* Контейнер названия категории */

.labelContainer {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.labelContainer_clickable {
  cursor: pointer;
}

.optionRow_hasChildren .labelContainer {
  padding-right: 36px;
}

.labelContainer_disabled {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}

.checkboxText {
  flex: 1;
  overflow: hidden;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
  font-family: "Roboto", var(--font-family, sans-serif);
  line-height: 1.5;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
}

/* Указатель курсора для кликабельного текста */

.labelContainer_clickable .checkboxText {
  cursor: pointer;
}

/* Hover эффект для всех кликабельных названий */

.labelContainer_clickable:hover .checkboxText {
  color: var(--accent-color);
  transition: color 0.2s ease;
}

.checkboxInput {
  display: none;
}

.checkboxIcon {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: 20px;
  height: 20px;
  background-image: url("../assets/checkbox-empty.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  cursor: pointer;
}

.checkboxInput:checked + .checkboxIcon {
  background-image: url("../assets/checkbox-done.svg");
}

.checkboxIcon_indeterminate {
  background-image: url("../assets/checkbox-remove.svg");
}

/* Стрелка - всегда видно */

.expandArrow {
  position: absolute;
  top: 50%;
  right: 12px;
  width: 16px;
  height: 16px;
  background-image: url("../assets/chevron-down.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%) rotate(180deg);
  opacity: 0.6;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.optionRow_hasChildren:hover .expandArrow {
  opacity: 1;
}

.expandArrow_expanded {
  transform: translateY(-50%) rotate(0deg);
  opacity: 1;
}

/* Дочерние элементы с плавной анимацией */

.childrenContainer {
  display: none;
  flex-direction: column;
  margin-left: 16px;
  padding-left: 8px;
}

/* Отступы между подкатегориями */

.childrenContainer .optionRow {
  margin-bottom: var(--card-small-tag-gap);
}

/* Убираем отступ у последней подкатегории */

.childrenContainer .optionRow:last-child {
  margin-bottom: 0;
}

.childrenContainer_expanded {
  display: flex;
  animation: slide-down 0.2s ease-out forwards;
}

.option {
  margin-bottom: 8px;
}

@keyframes slide-down {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.noOptions {
  padding: 12px 16px;
  color: var(--caption-color);
  font-weight: 400;
  font-size: 16px;
  font-family: "Roboto", var(--font-family, sans-serif);
  line-height: 1.5;
  letter-spacing: 0.02em;
  text-align: center;
}

/* Кнопка "Все категории" */

.showAllButton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: fit-content;
  padding: 6px 8px;
  color: var(--accent-color);
  font-weight: 400;
  font-size: 16px;
  font-family: "Roboto", var(--font-family, sans-serif);
  line-height: 1.5;
  letter-spacing: 0.02em;
  text-align: left;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.showAllButton:hover {
  background-color: var(--button-hover-color);
}

.showAllIcon {
  color: var(--accent-color);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.showAllIcon_expanded {
  transform: rotate(180deg);
}

/* Адаптив */

@media (width <= 1050px) {
  .trigger {
    min-width: 160px;
  }

  .dropdown {
    min-width: 200px;
  }
}

/* Accessibility */

@media (prefers-reduced-motion: reduce) {
  .trigger,
  .chevron {
    transition: none;
  }
}

@media (width <= 1180px) {
  .staticTitle {
    font-weight: var(--font-weight-h4);
    font-size: var(--font-size-h4);
    line-height: var(--line-height-h4);
  }

  .showAllButton {
    font-size: 13px;
    padding: 6px 9px;
  }
}

@media (600px <= width <= 890px) {
  .staticTitle {
    font-weight: var(--font-weight-h5);
    font-size: var(--font-size-h5);
    line-height: var(--line-height-h5);
  }

  .showAllButton {
    font-size: 12px;
    padding: 4px 6px;
  }

  .staticContainer {
    gap: 9px;
  }
}

@media (513px <= width <= 599px) {
  .staticTitle {
    font-size: 9px;
    font-weight: 500;
    line-height: 110%;
  }

  .showAllButton {
    font-size: 9px;
    padding: 3px 4px;
  }

  .staticContainer {
    gap: 6px;
  }

  .option {
    margin-bottom: 4px;
  }
}

@media (width <= 512px) {
  .staticTitle {
    font-size: 9px;
    font-weight: 500;
    line-height: 110%;
  }

  .showAllButton {
    font-size: 8px;
    padding: 2px 3px;
  }

  .staticContainer {
    gap: 5px;
  }

  .option {
    margin-bottom: 4px;
  }
}

</style>