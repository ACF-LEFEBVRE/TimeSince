import { createVuetify } from 'vuetify'
import 'vuetify/styles'

const vuetify = createVuetify({
  defaults: {
    VChip: {
      ripple: false,
    },
    VBtn: {
      ripple: false,
    },
  },
})

export default vuetify
