<template>
  <slot />
</template>

<script setup lang="ts">
        import { provide, ref, watch, onMounted, type Ref, defineProps } from 'vue';

        // Тип для темы
        type Theme = 'light' | 'dark';

        // Интерфейс для контекста
        interface ThemeContext {
            theme: Ref<Theme>;
            toggleTheme: () => void;
        }

       
         const ThemeKey = 'theme';

        // Пропсы компонента
        interface Props {
        initialTheme?: Theme;
        }

        const props = defineProps<Props>();

        // Состояние темы
        const theme = ref<Theme>(props.initialTheme || 'light');

        // Функция переключения темы
        const toggleTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        };

        // Предоставляем контекст дочерним компонентам
        provide<ThemeContext>(ThemeKey, {
            theme,
            toggleTheme
        });

        // Наблюдаем за изменением темы и обновляем класс на html
        watch(theme, (newTheme) => {
        const htmlTag = document.documentElement;
        if (htmlTag) {
            if (newTheme === 'dark') {
            htmlTag.classList.add('dark-theme');
            } else {
            htmlTag.classList.remove('dark-theme');
            }
        }
        }, { immediate: true }); // immediate: true применяет тему сразу при создании

        // Также применяем тему при монтировании (на случай, если watch не сработает)
        onMounted(() => {
        const htmlTag = document.documentElement;
        if (htmlTag) {
            if (theme.value === 'dark') {
            htmlTag.classList.add('dark-theme');
            } else {
            htmlTag.classList.remove('dark-theme');
            }
        }
        });
</script>