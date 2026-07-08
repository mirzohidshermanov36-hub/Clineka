import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { reveal } from './composables/useReveal.js'

const app = createApp(App)
app.directive('reveal', reveal)
app.mount('#app')
