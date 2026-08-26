<template>
  <t-layout class="min-h-screen">
    <t-header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-lg font-semibold">ProNavigator 管理后台</span>
          <t-menu
            class="ml-8"
            theme="light"
            :value="activeMenu"
            :collapse="false"
          >
            <t-menu-item
              value="categories"
              to="/admin/categories"
            >
              分类管理
            </t-menu-item>
            <t-menu-item
              value="websites"
              to="/admin/websites"
            >
              网站管理
            </t-menu-item>
          </t-menu>
        </div>
        <t-space>
          <t-button
            theme="default"
            variant="text"
            @click="goPassword"
          >
            修改密码
          </t-button>
          <t-button
            theme="danger"
            variant="text"
            @click="logout"
          >
            退出登录
          </t-button>
        </t-space>
      </div>
    </t-header>

    <t-content class="max-w-7xl mx-auto w-full px-4 py-6">
      <router-view />
    </t-content>
  </t-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => {
  if (route.path.startsWith('/admin/categories')) return 'categories';
  if (route.path.startsWith('/admin/websites')) return 'websites';
  return '';
});

function goPassword() {
  router.push('/admin/password');
}

async function logout() {
  const token = localStorage.getItem('nav_token');
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (err) {
      // ignore
    }
  }
  localStorage.removeItem('nav_token');
  MessagePlugin.success('已退出登录');
  router.push('/admin/login');
}
</script>
