<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <div class="header-inner">
        <span class="logo">ProNavigator 管理后台</span>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="header-menu"
        >
          <el-menu-item index="/admin/categories">
            分类管理
          </el-menu-item>
          <el-menu-item index="/admin/websites">
            网站管理
          </el-menu-item>
        </el-menu>
        <div class="header-actions">
          <el-button
            text
            @click="goPassword"
          >
            修改密码
          </el-button>
          <el-button
            text
            type="danger"
            @click="logout"
          >
            退出登录
          </el-button>
        </div>
      </div>
    </el-header>
    <el-main class="layout-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => {
  if (route.path.startsWith('/admin/categories')) return '/admin/categories';
  if (route.path.startsWith('/admin/websites')) return '/admin/websites';
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
  ElMessage.success('已退出登录');
  router.push('/admin/login');
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}
.layout-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
}
.logo {
  font-size: 18px;
  font-weight: 600;
  margin-right: 32px;
}
.header-menu {
  flex: 1;
  border-bottom: none;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.layout-main {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 24px;
}
</style>
