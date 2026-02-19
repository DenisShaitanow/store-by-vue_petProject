<template>
  <div :class="$style.calendar">
    <div :class="$style.header">
      <BaseDropdown :isOpen="isOpenMonth" @update:isOpen="isOpenMonth = $event">
        <template #trigger>
          <div :class="$style.triggerCont">
            {{ months[currentDate.getMonth()] }}
          </div>
        </template>
        <template #default>
          <ul :class="$style.contentList">
            <li
              v-for="(month, index) in months"
              :key="month"
              @click="changeMonth(index)"
              :class="{ [$style.active]: currentDate.getMonth() === index }"
            >
              {{ month }}
            </li>
          </ul>
        </template>
      </BaseDropdown>
      <BaseDropdown :isOpen="isOpenYear" @update:isOpen="isOpenYear = $event">
        <template #trigger>
          <div :class="$style.triggerCont">
            {{ currentDate.getFullYear() }}
          </div>
        </template>
        <template #default>
          <ul :class="$style.contentList">
            <li
              v-for="year in years"
              :key="year"
              @click="changeYear(parseInt(year))"
              :class="{ [$style.active]: currentDate.getFullYear() === parseInt(year) }"
            >
              {{ year }}
            </li>
          </ul>
        </template>
      </BaseDropdown>
    </div>

    <div :class="$style.weekdays">
      <div v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']" :key="day">
        {{ day }}
      </div>
    </div>

    <div :class="$style.days">
      <div
        v-for="date in dates"
        :key="date.getTime()"
        :class="[
          $style.day,
          {
            [$style.selected]: isSelected(date),
            [$style.today]: isToday(date),
            [$style.otherMonth]: date.getMonth() !== currentDate.getMonth(),
          },
        ]"
        @click="selectDate(date)"
      >
        {{ date.getDate() }}
      </div>
    </div>
    <div :class="$style.dpFooter">
      <button type="button" :class="[$style.dpbtn, $style.dpbtnCancel]" @click="removeDate">
        Отменить
      </button>
      <button
        type="button"
        :class="[$style.dpbtn, $style.dpbtnApply]"
        @click="handleSelectDatefotParentComponent"
      >
        Выбрать
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, defineProps, defineEmits } from 'vue';
  import BaseDropdown from '../baseDropdown/BaseDropdown.vue';
  import Button from '../button/Button.vue';

  const props = defineProps({
    modelValue: Date,
  });

  const emit = defineEmits(['update:modelValue']);

  // Основная дата для отображения календаря
  const currentDate = ref(props.modelValue ? new Date(props.modelValue) : new Date());
  const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null);

  // Отслеживаем изменения modelValue извне
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        const newDate = new Date(newValue);
        currentDate.value = newDate;
        selectedDate.value = newDate;
      }
    }
  );

  const isOpenMonth = ref(false);
  const isOpenYear = ref(false);

  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const years = (() => {
    const arr: string[] = [];
    for (let year = 1950; year <= 2026; year++) {
      arr.push(year.toString());
    }
    return arr;
  })();

  // Функция изменения месяца
  const changeMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(monthIndex);
    currentDate.value = newDate;
    isOpenMonth.value = false;
  };

  // Функция изменения года
  const changeYear = (year: number) => {
    const newDate = new Date(currentDate.value);
    newDate.setFullYear(year);
    currentDate.value = newDate;
    isOpenYear.value = false;
  };

  // Генерация дней календаря
  const dates = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();

    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    // Последний день месяца
    const lastDay = new Date(year, month + 1, 0);

    const dates: Date[] = [];

    // Дни предыдущего месяца (понедельник - воскресенье)
    // Получаем день недели первого дня месяца (0 - воскресенье, 1 - понедельник, ...)
    const firstDayOfWeek = firstDay.getDay(); // 0-6
    // Преобразуем к понедельнику = 0
    const mondayBasedDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Добавляем дни из предыдущего месяца
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = mondayBasedDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      dates.push(date);
    }

    // Дни текущего месяца
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }

    // Дни следующего месяца (чтобы заполнить до 42 ячеек - 6 недель)
    const totalCells = 42; // 6 недель * 7 дней
    const daysToAdd = totalCells - dates.length;
    for (let i = 1; i <= daysToAdd; i++) {
      dates.push(new Date(year, month + 1, i));
    }

    return dates;
  });

  // Навигация по месяцам
  const prevMonth = () => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() - 1);
    currentDate.value = newDate;
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() + 1);
    currentDate.value = newDate;
  };

  // Выбор даты
  const selectDate = (date: Date) => {
    // Если выбран день из другого месяца, меняем текущий месяц
    if (date.getMonth() !== currentDate.value.getMonth()) {
      currentDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
    }

    selectedDate.value = date;
  };

  const handleSelectDatefotParentComponent = () => {
    emit('update:modelValue', selectedDate.value);
  };

  const removeDate = () => {
    const todayDate = new Date();
    currentDate.value = todayDate;
    selectedDate.value = todayDate;
    emit('update:modelValue', todayDate);
  };

  // Проверка, выбрана ли дата
  const isSelected = (date: Date) => {
    if (!selectedDate.value) return false;

    return (
      date.getDate() === selectedDate.value.getDate() &&
      date.getMonth() === selectedDate.value.getMonth() &&
      date.getFullYear() === selectedDate.value.getFullYear()
    );
  };

  // Проверка, сегодняшняя ли дата
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
</script>

<style module scoped>
  .calendar {
    width: 250px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background: white;
    font-family: var(--font-family);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-inline: 10px;
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 8px;
    color: #666;
    font-size: 12px;
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .day {
    text-align: center;
    padding: 3px;
    border-radius: 4px;
    cursor: pointer;
  }

  .day:hover {
    background: #f0f0f0;
  }

  .selected {
    background: #4caf50;
    color: white;
  }

  .today {
    border: 1px solid #4caf50;
  }

  .otherMonth {
    color: #999;
  }

  .triggerCont {
    color: var(--accent-color);
  }

  .contentList {
    width: fit-content;
    max-height: 80px;
    overflow-y: scroll;
    position: absolute;
    z-index: 2;
    background-color: #fffbfb;
    border: solid 1px var(--text-color);
    border-radius: 5px;
    padding: 3px;
  }

  .dpFooter {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
  }

  .dpbtn {
    display: flex;
    --btn-width: 105px;
    justify-content: center;
    align-items: center;
    width: var(--btn-width);
    height: 38px;
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 12px;
    cursor: pointer;
    transition:
      background-color 120ms ease,
      color 120ms ease,
      border-color 120ms ease,
      width 120ms ease;
    touch-action: manipulation;
  }

  .dpbtnCancel {
    color: var(--calendar-text);
    background: transparent;
    border: 1px solid var(--calendar-accent);
  }

  .dpbtnApply {
    color: var(--calendar-text);
    background: transparent;
    border: 1px solid var(--calendar-accent);
  }

  .dpbtnCancel:hover,
  .dpbtnCancel:active,
  .dpbtnApply:hover,
  .dpbtnApply:active {
    width: calc(var(--btn-width) - 10px);
    color: var(--calendar-text);
    background: var(--calendar-accent);
    border-color: var(--calendar-accent);
  }
</style>
