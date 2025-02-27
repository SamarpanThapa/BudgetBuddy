import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Create Pinia store instance
const pinia = createPinia()

// Create and mount the Vue application
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
