
import { createApp } from 'vue'
import App from './App.vue'
/*import './assets/main.css'*/ // Глобальные стили

// Если используете роутер/Pinia/другие плагины — подключайте здесь
// import router from './router'
// import { createPinia } from 'pinia'

const app = createApp(App)

// app.use(router)
// app.use(createPinia())

app.mount('#root')