// Import основного компонента
import Calendar from './Datapicker.vue';

// Важный импорт для работы с Storybook в Vue
import type { Meta, StoryFn } from '@storybook/vue3';

// Здесь мы определяем мета-данные для нашего компонента
const meta: Meta = {
  title: 'ui/Calendar', // Название группы историй (используется для навигации)
  component: Calendar, // Компонент, для которого создаются истории
  tags: ['autodocs'], // Опциональный тег для автоматической документации
};

export default meta;

// Основной сценарий истории
const Template: StoryFn = (args) => ({
  components: { Calendar },
  setup() {
    return { args };
  },
  template: '<Calendar v-bind="args"/>',
});

// Первая история: базовый календарь
export const Default = Template.bind({}); // Привязываем аргументы к нашему шаблону
Default.args = {}; // Начальные значения аргументов (опционально)
