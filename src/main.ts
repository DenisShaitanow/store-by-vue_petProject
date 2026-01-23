
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store/index';
import "./index.css";
/*import './assets/main.css'*/ // Глобальные стили

// Если используете роутер/Pinia/другие плагины — подключайте здесь
// import router from './router'
// import { createPinia } from 'pinia'

const app = createApp(App)

// app.use(router)
// app.use(createPinia())
app.use(router);
app.use(store);

app.mount('#root')