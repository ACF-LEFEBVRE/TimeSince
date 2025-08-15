<template>
  <VDialog v-model="dialog" max-width="500px">
    <VCard>
      <VCardTitle class="text-h5">{{ text.deleteCategory }}</VCardTitle>
      <VCardText>
        {{ text.deleteConfirmation }} <b>{{ props.categoryName }}</b
        >?
      </VCardText>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" variant="text" @click="onCancel">
          {{ text.cancel }}
        </VBtn>
        <VBtn color="error" @click="onConfirm" :loading="props.loading">
          {{ text.delete }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

// PROPS
const props = defineProps({
  categoryName: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// MODEL
const dialog = defineModel('modelValue')

// TRANSLATIONS
const { t } = useI18n()

const text = {
  cancel: t('common.cancel'),
  delete: t('common.delete'),
  deleteCategory: t('categories.deleteCategory'),
  deleteConfirmation: t('categories.deleteConfirmation'),
}

// EVENTS
const emit = defineEmits(['confirm', 'cancel'])

// METHODS
const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>
