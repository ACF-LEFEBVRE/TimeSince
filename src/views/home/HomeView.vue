<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <WelcomeCard :email="currentUser?.email ?? undefined" @logout="logout" />
      </VCol>
    </VRow>
    <VRow class="mt-5">
      <VCol cols="12">
        <FavoriteCounters :counters="favoriteCounters" :loading="isLoading" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import WelcomeCard from '@/views/home/components/WelcomeCard.vue'
import FavoriteCounters from '@/views/home/components/FavoriteCounters.vue'
import { useAuth } from '@/composables/useAuth'
import { useCounters } from '@/composables/useCounters'

// COMPOSABLES
const { currentUser, userId, logout } = useAuth()
const { favoriteCounters, isLoading } = useCounters(userId)
</script>
