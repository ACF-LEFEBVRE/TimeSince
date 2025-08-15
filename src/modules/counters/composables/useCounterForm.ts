import { useI18n } from 'vue-i18n'

export function useCounterForm() {
  // TRANSLATION
  const { t } = useI18n()

  const colorOptions = [
    { text: t('counters.colors.blue'), value: 'primary' },
    { text: t('counters.colors.green'), value: 'success' },
    { text: t('counters.colors.orange'), value: 'warning' },
    { text: t('counters.colors.purple'), value: 'purple' },
    { text: t('counters.colors.red'), value: 'error' },
  ]

  const iconOptions = [
    { text: t('counters.icons.calendar'), value: 'mdi-calendar-clock' },
    { text: t('counters.icons.gift'), value: 'mdi-gift' },
    { text: t('counters.icons.heart'), value: 'mdi-heart' },
    { text: t('counters.icons.sport'), value: 'mdi-run' },
    { text: t('counters.icons.star'), value: 'mdi-star' },
    { text: t('counters.icons.trophy'), value: 'mdi-trophy' },
  ]

  return {
    colorOptions,
    iconOptions,
  }
}
