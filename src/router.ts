import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { getAuth } from 'firebase/auth';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/counters',
    name: 'Counters',
    component: () => import('./views/CountersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/home',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navegación protegida
router.beforeEach(async (to, _from, next) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (to.path === '/login' && currentUser) {
    next('/home');
  } else {
    next();
  }
});

export default router;
