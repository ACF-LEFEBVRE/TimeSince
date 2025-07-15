<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
  });
});

const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>

<template>
  <VApp>
    <VAppBar color="primary" dark flat>
      <VToolbarTitle class="cursor-pointer" @click="router.push('/home')"
        >TimeSince</VToolbarTitle
      >
      <VSpacer></VSpacer>
      <div v-if="isAuthenticated">
        <VBtn to="/home" variant="text">Home</VBtn>
        <VBtn to="/counters" variant="text">Contadores</VBtn>
        <VBtn @click="logout" variant="text" prepend-icon="mdi-logout">
          Cerrar sesión
        </VBtn>
      </div>
    </VAppBar>
    <VMain class="fill-height">
      <router-view />
    </VMain>
  </VApp>
</template>

<style scoped>
/* Estilos para layout */
.v-application {
  width: 100%;
  height: 100%;
}

.v-main {
  width: 100%;
  min-height: calc(100vh - 64px); /* altura total menos la altura de VAppBar */
}
</style>
