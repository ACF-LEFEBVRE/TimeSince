<template>
  <section class="help-container mt-6">
    <div class="help-title">
      <span class="help-text">{{ text.help }}</span>
    </div>
    <div class="help-info">
      <div>
        <span><a class="email" href="mailto:info@timesince.es">info@timesince.es</a></span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

// TRANSLATIONS
const { t } = useI18n()

const text = {
  help: t('auth.help'),
}
</script>

<style lang="scss" scoped>
.help-container {
  display: flex;
  padding: $spacing-md;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: $spacing-xs;
  align-self: stretch;
  background: $main-050;

  .help-title {
    font-family: $title-font;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    .help-text {
      color: $neutral-grey-900;
      font-size: $font-size-md;
    }
  }

  .help-info {
    @include flex;
    color: $neutral-grey-700;

    .email {
      text-decoration: none;
      margin-top: $spacing-xxs;
      color: $tertiary-byzantineBlue-200;
    }
  }
}
</style>
