import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router/router'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import '@mdi/font/css/materialdesignicons.css'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(i18n)
app.use(pinia)
app.mount('#app')
