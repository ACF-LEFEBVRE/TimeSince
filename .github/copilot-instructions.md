# Copilot Instructions for Vue 3

## Project Overview

This project is created with Vue 3 and we need to follow the best and most modern practices recommended for the framework.

This project serves to create counters to remember significant moments or events in your life.

## Tech Stack

- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** for type safety (required for all components)
- **Vuetify** for UI components
- **Vue Router** for routing
- **Vue I18n** for internationalization

### Component Structure

Components follow a "Screaming Architecture" pattern, organized by business capabilities rather than technical function.

### Translations

- I want to use a text variable of object type in which to include all the translations of a particular component.
- I want to include one linebreak between const { t } = useI18n()
  and const text = {}

### Other

- I want to sort all imports alphabetically, and I want to use the `@` alias for the `src` directory.
- I want to sort typescript objects alphabetically

### Comment rendering in components

If there is no code relevant to a specific section (e.g., EVENTS, HOOKS, etc.), do not include the comment for that section in the `<script setup>` block. Only render section comments when there is actual code below them. This keeps the component files clean and concise.

Standard component template:

```vue
<template>
  <!-- Vue 3 template -->
</template>

<script lang="ts" setup>

// PROPS
const props = defineProps({...})

// EVENTS
const emit = defineEmits([...])

// TRANSLATIONS

// COMPOSABLES

// COMPUTED

// METHODS

// EVENTS

// HOOKS
</script>

<style lang="scss" scoped>
/* Component styles */
</style>
```
