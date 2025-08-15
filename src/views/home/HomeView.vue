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
    <VRow class="mt-5">
      <VCol cols="12">
        <RecentCounters :counters="allCounters" :loading="isLoading" :limit="10" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import FavoriteCounters from '@/views/home/components/FavoriteCounters.vue'
import RecentCounters from '@/views/home/components/RecentCounters.vue'
import WelcomeCard from '@/views/home/components/WelcomeCard.vue'
import { useAuth } from '@/composables/useAuth'
import { useCounters } from '@/modules/counters/composables/useCounters'

// COMPOSABLES
const { currentUser, userId, logout } = useAuth()
const { allCounters, favoriteCounters, isLoading } = useCounters(userId)
</script>
