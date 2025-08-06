<template>
  <VCard class="welcome-card">
    <div class="welcome-header">
      <VCardTitle class="welcome-title">
        {{ text.welcome }} <span class="app-name">TimeSince</span>
      </VCardTitle>
    </div>

    <VCardText class="welcome-content">
      <p class="user-greeting" v-if="email">
        {{ text.hello }}, <span class="user-email">{{ props.email }}</span>
      </p>
      <p class="welcome-description" v-html="text.description" />
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// TRANSLATION
const { t } = useI18n()

const text = {
  description: t('home.description'),
  hello: t('home.hello'),
  welcome: t('home.welcome'),
}

// PROPS
const props = defineProps({
  email: {
    type: String,
    default: undefined,
  },
})

// EVENTS
const emit = defineEmits(['logout'])
</script>

<style lang="scss" scoped>
.welcome-card {
  border-radius: $cornerRadius-lg;
  box-shadow: $shadow-md !important;
  border: 1px solid $main-200;

  .welcome-header {
    @include flex($justify: space-between);
    padding: $spacing-lg $spacing-xl;
    background: $main-900;

    .welcome-title {
      font-family: $title-font;
      font-size: $font-size-xl;
      color: $white;
      font-weight: bold;
    }
  }

  .welcome-content {
    padding: $spacing-lg $spacing-xl;

    .user-greeting {
      font-family: $title-font;
      font-size: $font-size-sm;
      margin-bottom: $spacing-md;
      color: $main-color;

      .user-email {
        font-weight: bold;
      }
    }

    .welcome-description {
      font-family: $text-font;
      font-size: $font-size-sm;
      line-height: 1.6;
      color: $neutral-grey-700;
    }
  }
}
</style>
