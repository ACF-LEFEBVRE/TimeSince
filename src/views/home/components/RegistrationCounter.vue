<template>
  <VCard class="registration-counter">
    <VCardTitle class="text-h5">{{ text.daysAsUser }}</VCardTitle>
    <div class="counter-display">
      <div class="counter-value">{{ days }}</div>
      <div class="counter-label">{{ text.days }}</div>
    </div>
    <VCardText>{{ text.registered }} {{ formattedDate }}</VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  daysAsUser: 'Días como usuario de TimeSince',
  days: t('counters.days'),
  registered: 'Te registraste el',
}

// PROPS
const { days, formattedDate } = defineProps({
  days: {
    type: Number,
    required: true,
  },
  formattedDate: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.registration-counter {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(to bottom right, #e6f7ff, #ffffff);
  border-left: 4px solid #1976d2;
}

.counter-display {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: #1976d2;
}

.counter-label {
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.5rem;
  color: #666;
}
</style>
