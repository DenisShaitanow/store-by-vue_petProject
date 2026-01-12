<script setup>

    import Logo from './ui/logo/logo.vue';
    // Здесь можно подключить глобальные стили, провайдеры и т.п.
</script>
    
<template>
      <div id="app">
        <!-- Ваш основной контент -->
        <!--<router-view v-if="useRouter()"></router-view> --> <!-- Если используете роутер -->
        <!-- Или просто содержимое -->
        <h1>Добро пожаловать в Vue-проект!</h1>
        <Logo />
      </div>
</template>
    
<style scoped>
    /* Глобальные стили (опционально) */
        #app {
        font-family: Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        }
</style>