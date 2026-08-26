import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Detail from '../views/Detail.vue';
import Login from '../views/admin/Login.vue';
import Categories from '../views/admin/Categories.vue';
import Websites from '../views/admin/Websites.vue';
import Password from '../views/admin/Password.vue';
import AuditLogs from '../views/admin/AuditLogs.vue';

const routes = [
  { path: '/', component: Home, meta: { title: 'ProNavigator' } },
  { path: '/website/:id', component: Detail, meta: { title: '网站详情' } },
  { path: '/admin/login', component: Login, meta: { title: '管理员登录' } },
  { path: '/admin/categories', component: Categories, meta: { title: '分类管理', requiresAuth: true } },
  { path: '/admin/websites', component: Websites, meta: { title: '网站管理', requiresAuth: true } },
  { path: '/admin/password', component: Password, meta: { title: '修改密码', requiresAuth: true } },
  { path: '/admin/audit-logs', component: AuditLogs, meta: { title: '审计日志', requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - ProNavigator`;
  }

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('nav_token');
    if (!token) {
      next('/admin/login');
      return;
    }
  }
  next();
});

export default router;
