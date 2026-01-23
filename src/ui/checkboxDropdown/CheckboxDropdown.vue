<template>
  <!-- Static mode -->
  <div
    v-if="staticMode"
    :class="[
      $style.staticContainer,
      className,
      staticMode && $style.staticMode,
    ]"
  >
    <h3 v-if="title" :class="$style.staticTitle">{{ title }}</h3>
    
    <div :class="$style.content">
      <!-- Search input -->
      <div v-if="enableSearch" :class="$style.searchContainer">
        <SearchInput
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          :class="$style.searchInput"
        />
      </div>

      <div :class="$style.optionsList">
        <!-- No options -->
        <div v-if="filteredOptions.length === 0" :class="$style.noOptions">
          {{ enableSearch && searchQuery ? 'Ничего не найдено' : 'Нет доступных опций' }}
        </div>

        <!-- Tree mode -->
        <div
          v-else-if="treeMode"
          :class="$style.treeContainer"
        >
          <ExpandableList
            :max-visible-items="maxVisibleOptions"
            :show-all-text="showAllText"
            :collapse-text="collapseText"
            :additional-items-class-name="$style.additionalOptions"
            :additional-items-expanded-class-name="$style.additionalOptions_show"
            :button-class-name="$style.showAllButton"
          >
            <template #default>
              <template
                v-for="option in filteredOptions"
                :key="option.value"
              >
                <!-- Render tree option -->
                <div
                  :class="[
                    $style.optionRow,
                    option.children?.length && $style.optionRow_hasChildren,
                    expandedCategories.has(option.value) && $style.optionRow_expanded,
                  ]"
                >
                  <!-- Checkbox -->
                  <div :class="$style.checkboxContainer">
                    <input
                      :id="`checkbox-${option.value}`"
                      type="checkbox"
                      :class="$style.checkboxInput"
                      :checked="getCheckboxState(option) === 'checked'"
                      :ref="el => setIndeterminate(el, option)"
                      :disabled="disabled || option.disabled"
                      @change="() => !disabled && handleTreeOptionToggle(option)"
                      @click.stop
                    />
                    <label
                      :for="`checkbox-${option.value}`"
                      :class="[
                        $style.checkboxIcon,
                        getCheckboxState(option) === 'indeterminate' && $style.checkboxIcon_indeterminate,
                      ]"
                    />
                  </div>

                  <!-- Label -->
                  <div
                    :class="[
                      $style.labelContainer,
                      (disabled || option.disabled) && $style.labelContainer_disabled,
                      (!disabled && !option.disabled) && $style.labelContainer_clickable,
                    ]"
                    @click.stop="() => handleOptionClick(option)"
                  >
                    <span :class="$style.checkboxText">{{ option.label }}</span>
                  </div>

                  <!-- Expand arrow -->
                  <div
                    v-if="option.children?.length"
                    :class="[
                      $style.expandArrow,
                      expandedCategories.has(option.value) && $style.expandArrow_expanded,
                    ]"
                  />
                </div>

                <!-- Children container -->
                <div
                  v-if="option.children?.length && expandedCategories.has(option.value)"
                  :class="$style.childrenContainer"
                >
                  <template
                    v-for="child in option.children"
                    :key="child.value"
                  >
                    <div
                      :class="[
                        $style.optionRow,
                        $style.optionRow_child,
                        child.children?.length && $style.optionRow_hasChildren,
                        expandedCategories.has(child.value) && $style.optionRow_expanded,
                      ]"
                    >
                      <!-- Child checkbox -->
                      <div :class="$style.checkboxContainer">
                        <input
                          :id="`checkbox-${child.value}`"
                          type="checkbox"
                          :class="$style.checkboxInput"
                          :checked="getCheckboxState(child) === 'checked'"
                          :ref="el => setIndeterminate(el, child)"
                          :disabled="disabled || child.disabled"
                          @change="() => !disabled && handleTreeOptionToggle(child)"
                          @click.stop
                        />
                        <label
                          :for="`checkbox-${child.value}`"
                          :class="[
                            $style.checkboxIcon,
                            getCheckboxState(child) === 'indeterminate' && $style.checkboxIcon_indeterminate,
                          ]"
                        />
                      </div>

                      <!-- Child label -->
                      <div
                        :class="[
                          $style.labelContainer,
                          (disabled || child.disabled) && $style.labelContainer_disabled,
                          (!disabled && !child.disabled) && $style.labelContainer_clickable,
                        ]"
                        @click.stop="() => handleOptionClick(child)"
                      >
                        <span :class="$style.checkboxText">{{ child.label }}</span>
                      </div>

                      <!-- Child expand arrow -->
                      <div
                        v-if="child.children?.length"
                        :class="[
                          $style.expandArrow,
                          expandedCategories.has(child.value) && $style.expandArrow_expanded,
                        ]"
                      />
                    </div>

                    <!-- Grandchildren (recursive would be better with a component) -->
                    <div
                      v-if="child.children?.length && expandedCategories.has(child.value)"
                      :class="$style.childrenContainer"
                    >
                      <template
                        v-for="grandchild in child.children"
                        :key="grandchild.value"
                      >
                        <div :class="[$style.optionRow, $style.optionRow_grandchild]">
                          <div :class="$style.checkboxContainer">
                            <input
                              :id="`checkbox-${grandchild.value}`"
                              type="checkbox"
                              :class="$style.checkboxInput"
                              :checked="selectedValuesComputed.includes(grandchild.value)"
                              :disabled="disabled || grandchild.disabled"
                              @change="() => !disabled && handleTreeOptionToggle(grandchild)"
                              @click.stop
                            />
                            <label
                              :for="`checkbox-${grandchild.value}`"
                              :class="$style.checkboxIcon"
                            />
                          </div>
                          <div
                            :class="[
                              $style.labelContainer,
                              (disabled || grandchild.disabled) && $style.labelContainer_disabled,
                              (!disabled && !grandchild.disabled) && $style.labelContainer_clickable,
                            ]"
                            @click.stop="() => handleTreeOptionToggle(grandchild)"
                          >
                            <span :class="$style.checkboxText">{{ grandchild.label }}</span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </ExpandableList>
        </div>

        <!-- Simple mode (checkbox list) -->
        <ExpandableList
          v-else
          :max-visible-items="maxVisibleOptions"
          :show-all-text="showAllText"
          :collapse-text="collapseText"
          :additional-items-class-name="$style.additionalOptions"
          :additional-items-expanded-class-name="$style.additionalOptions_show"
          :button-class-name="$style.showAllButton"
        >
          <template #default>
            <div
              v-for="option in filteredOptions"
              :key="option.value"
              :class="$style.option"
            >
              <CheckboxGroupUI
                :field-names="[option.label]"
                :selected-items="
                  selectedValuesComputed.includes(option.value)
                    ? [option.label]
                    : []
                "
                @change="(checked: boolean) => handleCheckboxChange(checked, option.label)"
                :with-in-dropdown="!staticMode"
              />
            </div>
          </template>
        </ExpandableList>
      </div>
    </div>
  </div>

  <!-- Dropdown mode -->
  <BaseDropdown
    v-else
    v-model:is-open="isOpen"
    :placement="placement"
    :offset="offset"
    :close-on-click-outside="closeOnClickOutside"
    :close-on-escape="closeOnEscape"
    :disabled="disabled"
    :class="[className, $style.dropdownWrapper]"
    :dropdown-class-name="$style.dropdown"
    :aria-label="ariaLabel || 'Выпадающий список с множественным выбором'"
  >
    <template #trigger="{ toggle }">
      <div
        :class="[
          $style.trigger,
          triggerClassName,
          disabled && $style.trigger_disabled,
          isOpen && $style.trigger_open,
          selectedValuesComputed.length > 0 && $style.trigger_has_selection,
        ]"
        @click="toggle"
      >
        <span :class="$style.triggerText">
          {{
            selectedValuesComputed.length > 0
              ? selectedValuesComputed
                .map(val => {
                  const opt = normalizedOptions.find(o => o.value === val);
                  return opt ? opt.label : val;
                })
                .join(', ')
              : placeholder
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
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </template>
    
    <template #default>
      <div :class="$style.content">
        <div v-if="enableSearch" :class="$style.searchContainer">
          <SearchInput
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            :class="$style.searchInput"
          />
        </div>

        <div :class="$style.optionsList">
          <!-- No options -->
          <div v-if="filteredOptions.length === 0" :class="$style.noOptions">
            {{ enableSearch && searchQuery ? 'Ничего не найдено' : 'Нет доступных опций' }}
          </div>

          <!-- Tree mode in dropdown -->
          <div
            v-else-if="treeMode"
            :class="$style.treeContainer"
          >
            <!-- Same tree rendering as in static mode -->
            <template
              v-for="option in filteredOptions"
              :key="option.value"
            >
              <div
                :class="[
                  $style.optionRow,
                  option.children?.length && $style.optionRow_hasChildren,
                  expandedCategories.has(option.value) && $style.optionRow_expanded,
                ]"
              >
                <!-- Same checkbox structure -->
                <div :class="$style.checkboxContainer">
                  <input
                    :id="`dropdown-checkbox-${option.value}`"
                    type="checkbox"
                    :class="$style.checkboxInput"
                    :checked="getCheckboxState(option) === 'checked'"
                    :ref="el => setIndeterminate(el, option)"
                    :disabled="disabled || option.disabled"
                    @change="() => !disabled && handleTreeOptionToggle(option)"
                    @click.stop
                  />
                  <label
                    :for="`dropdown-checkbox-${option.value}`"
                    :class="[
                      $style.checkboxIcon,
                      getCheckboxState(option) === 'indeterminate' && $style.checkboxIcon_indeterminate,
                    ]"
                  />
                </div>

                <div
                  :class="[
                    $style.labelContainer,
                    (disabled || option.disabled) && $style.labelContainer_disabled,
                    (!disabled && !option.disabled) && $style.labelContainer_clickable,
                  ]"
                  @click.stop="() => handleOptionClick(option)"
                >
                  <span :class="$style.checkboxText">{{ option.label }}</span>
                </div>

                <div
                  v-if="option.children?.length"
                  :class="[
                    $style.expandArrow,
                    expandedCategories.has(option.value) && $style.expandArrow_expanded,
                  ]"
                />
              </div>

              <!-- Same children rendering -->
              <div
                v-if="option.children?.length && expandedCategories.has(option.value)"
                :class="$style.childrenContainer"
              >
                <template
                  v-for="child in option.children"
                  :key="child.value"
                >
                  <!-- Child rendering -->
                  <div
                    :class="[
                      $style.optionRow,
                      $style.optionRow_child,
                      child.children?.length && $style.optionRow_hasChildren,
                      expandedCategories.has(child.value) && $style.optionRow_expanded,
                    ]"
                  >
                    <!-- Same structure for children -->
                    <div :class="$style.checkboxContainer">
                      <input
                        :id="`dropdown-checkbox-${child.value}`"
                        type="checkbox"
                        :class="$style.checkboxInput"
                        :checked="getCheckboxState(child) === 'checked'"
                        :ref="el => setIndeterminate(el, child)"
                        :disabled="disabled || child.disabled"
                        @change="() => !disabled && handleTreeOptionToggle(child)"
                        @click.stop
                      />
                      <label
                        :for="`dropdown-checkbox-${child.value}`"
                        :class="[
                          $style.checkboxIcon,
                          getCheckboxState(child) === 'indeterminate' && $style.checkboxIcon_indeterminate,
                        ]"
                      />
                    </div>

                    <div
                      :class="[
                        $style.labelContainer,
                        (disabled || child.disabled) && $style.labelContainer_disabled,
                        (!disabled && !child.disabled) && $style.labelContainer_clickable,
                      ]"
                      @click.stop="() => handleOptionClick(child)"
                    >
                      <span :class="$style.checkboxText">{{ child.label }}</span>
                    </div>

                    <div
                      v-if="child.children?.length"
                      :class="[
                        $style.expandArrow,
                        expandedCategories.has(child.value) && $style.expandArrow_expanded,
                      ]"
                    />
                  </div>

                  <!-- Grandchildren -->
                  <div
                    v-if="child.children?.length && expandedCategories.has(child.value)"
                    :class="$style.childrenContainer"
                  >
                    <template
                      v-for="grandchild in child.children"
                      :key="grandchild.value"
                    >
                      <div :class="[$style.optionRow, $style.optionRow_grandchild]">
                        <div :class="$style.checkboxContainer">
                          <input
                            :id="`dropdown-checkbox-${grandchild.value}`"
                            type="checkbox"
                            :class="$style.checkboxInput"
                            :checked="selectedValuesComputed.includes(grandchild.value)"
                            :disabled="disabled || grandchild.disabled"
                            @change="() => !disabled && handleTreeOptionToggle(grandchild)"
                            @click.stop
                          />
                          <label
                            :for="`dropdown-checkbox-${grandchild.value}`"
                            :class="$style.checkboxIcon"
                          />
                        </div>
                        <div
                          :class="[
                            $style.labelContainer,
                            (disabled || grandchild.disabled) && $style.labelContainer_disabled,
                            (!disabled && !grandchild.disabled) && $style.labelContainer_clickable,
                          ]"
                          @click.stop="() => handleTreeOptionToggle(grandchild)"
                        >
                          <span :class="$style.checkboxText">{{ grandchild.label }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>

          <!-- Simple mode in dropdown -->
          <ExpandableList
            v-else
            :max-visible-items="maxVisibleOptions"
            :show-all-text="showAllText"
            :collapse-text="collapseText"
            :additional-items-class-name="$style.additionalOptions"
            :additional-items-expanded-class-name="$style.additionalOptions_show"
            :button-class-name="$style.showAllButton"
          >
            <template #default>
              <div
                v-for="option in filteredOptions"
                :key="option.value"
                :class="$style.option"
              >
                <CheckboxGroupUI
                  :field-names="[option.label]"
                  :selected-items="
                    selectedValuesComputed.includes(option.value)
                      ? [option.label]
                      : []
                  "
                  @change="(checked: boolean) => handleCheckboxChange(checked, option.label)"
                  with-in-dropdown
                />
              </div>
            </template>
          </ExpandableList>
        </div>
      </div>
    </template>
  </BaseDropdown>
</template>

<script setup lang="ts">
    import { ref, computed, toRefs, withDefaults, onMounted, defineProps, defineEmits, onUnmounted, watch } from 'vue';
    import CheckboxGroupUI from '../checkbox/CheckboxGroup.vue';
    import BaseDropdown from '../baseDropdown/BaseDropdown.vue';
    import SearchInput from '../searchInput/SearchInput.vue';
    import ExpandableList from '../expandlableList/ExpandableList.vue';

    export interface CheckboxOption {
      value: string | number;
      label: string;
      disabled?: boolean;
      children?: CheckboxOption[];
    }

    export interface CheckboxDropdownProps {
      options: CheckboxOption[] | string[];
      selectedValues?: (string | number)[];
      defaultSelectedValues?: (string | number)[];
      onChange?: (selectedValues: (string | number)[]) => void;
      placeholder?: string;
      title?: string;
      enableSearch?: boolean;
      searchPlaceholder?: string;
      treeMode?: boolean;
      maxVisibleOptions?: number;
      showAllText?: string;
      collapseText?: string;
      staticMode?: boolean;
      disabled?: boolean;
      className?: string;
      dropdownClassName?: string;
      triggerClassName?: string;
      placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
      offset?: number;
      closeOnClickOutside?: boolean;
      closeOnEscape?: boolean;
      "aria-label"?: string;
    }

    // Определяем emits ПЕРЕД props
    const emit = defineEmits<{
      change: [values: (string | number)[]]
    }>();

    // Props with defaults
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

    const { 
      selectedValues, 
      defaultSelectedValues, 
      options,
      title,
      className,
      placeholder,
      enableSearch,
      searchPlaceholder,
      treeMode,
      maxVisibleOptions,
      showAllText,
      collapseText,
      staticMode,
      disabled,
      triggerClassName,
      placement,
      offset,
      closeOnClickOutside,
      closeOnEscape,
      ariaLabel
    } = toRefs(props);

    // Local state
    const internalSelectedValues = ref<(string | number)[]>(
      defaultSelectedValues?.value ?? []
    );
    const searchQuery = ref('');
    const isOpen = ref(false);
    const expandedCategories = ref<Set<string | number>>(new Set());

    // Computed selected values
    const selectedValuesComputed = computed(() =>
      selectedValues?.value ?? internalSelectedValues.value
    );

    // Normalized options
    const normalizedOptions = computed((): CheckboxOption[] =>
      options.value.map((option, index) => {
        if (typeof option === 'string') {
          return { value: index, label: option };
        }
        return option;
      })
    );

    // Filtered options
    const filteredOptions = computed(() => {
      if (!enableSearch.value || !searchQuery.value.trim()) return normalizedOptions.value;
      const query = searchQuery.value.toLowerCase().trim();
      return normalizedOptions.value.filter((option) =>
        option.label.toLowerCase().includes(query)
      );
    });

    // Helper methods
    const getAllChildren = (option: CheckboxOption): (string | number)[] =>
      option.children ? option.children.flatMap(getAllChildren) : [option.value];

    const getCheckboxState = (option: CheckboxOption) => {
      if (!treeMode.value || !option.children) {
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

    const setIndeterminate = (el: HTMLInputElement | null, option: CheckboxOption) => {
      if (el) {
        el.indeterminate = getCheckboxState(option) === 'indeterminate';
      }
    };

    const handleOptionClick = (option: CheckboxOption) => {
      if (disabled.value || option.disabled) return;
      
      if (option.children?.length) {
        toggleCategory(option.value);
      } else {
        handleTreeOptionToggle(option);
      }
    };

    const toggleCategory = (categoryValue: string | number) => {
      const next = new Set(expandedCategories.value);
      next.has(categoryValue)
        ? next.delete(categoryValue)
        : next.add(categoryValue);
      expandedCategories.value = next;
    };

    const handleTreeOptionToggle = (option: CheckboxOption) => {
      const newSelected = treeMode.value && option.children
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

      if (selectedValues?.value === undefined) {
        internalSelectedValues.value = newSelected;
      }
      
      // Emit event
      emit('change', newSelected);
    };

    const handleCheckboxChange = (newValue: boolean, label: string) => {
      const option = filteredOptions.value.find((opt) => opt.label === label);
      if (!option) return;

      const newSelected = newValue
        ? [...selectedValuesComputed.value, option.value]
        : selectedValuesComputed.value.filter((v) => v !== option.value);

      if (selectedValues?.value === undefined) {
        internalSelectedValues.value = newSelected;
      }
      
      emit('change', newSelected);
    };

    onMounted(() => {
      console.log('Компонент смонтирован');
      console.log('Props options:', props.options);
      console.log('Normalized options:', normalizedOptions.value);
      console.log('Filtered options:', filteredOptions.value);
    });

    onUnmounted(() => {
      console.log('Компонент размонтирован')
    })
</script>

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