import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes, isAlowed } from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  isAlowed(to) ? next() : (window.location.href = '/');
});
export default router;
