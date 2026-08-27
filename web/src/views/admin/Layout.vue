<template>
  <el-container
    class="admin-layout"
    direction="vertical"
  >
    <el-header class="admin-header">
      <div class="pn-container header-inner">
        <a
          class="brand"
          href="/"
        >
          <span class="brand-name">ProNavigator</span>
        </a>
        <el-menu
          :default-active="activeTab"
          mode="horizontal"
          class="admin-menu"
        >
          <el-menu-item
            index="content"
            @click="switchTab('content')"
          >
            内容管理
          </el-menu-item>
          <el-menu-item
            index="audit-logs"
            @click="switchTab('audit-logs')"
          >
            审计日志
          </el-menu-item>
        </el-menu>
        <div class="header-actions">
          <div
            class="header-action"
            :class="{ 'is-active': isPasswordActive }"
            @click="goPassword"
          >
            修改密码
          </div>
          <div
            class="header-action"
            @click="logout"
          >
            退出登录
          </div>
        </div>
      </div>
    </el-header>

    <el-main class="admin-main pn-container">
      <slot />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const activeTab = computed(() => {
  const tab = route.query.tab;
  if (tab === 'content' || tab === 'audit-logs') return tab;
  return 'content';
});

const isPasswordActive = computed(() => route.path === '/admin/password');

function switchTab(tab) {
  router.push({ path: '/admin', query: { ...route.query, tab } });
}

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
.admin-layout {
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #18181b 0%, var(--pn-bg-base) 60%);
}
.admin-header {
  height: 64px;
  padding: 0;
  background-color: var(--pn-bg-base);
  border-bottom: 1px solid var(--pn-border-color);
}
.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 48px;
  text-decoration: none;
  cursor: pointer;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--pn-text-primary);
}
.admin-menu {
  flex: 1;
  background-color: transparent;
  border-bottom: none;
}
.admin-main {
  padding-top: 24px;
  padding-bottom: 24px;
}
.header-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.header-action {
  padding: 0 16px;
  font-size: var(--el-font-size-base);
  color: var(--el-menu-text-color);
  cursor: pointer;
  transition: color 0.3s;
  white-space: nowrap;
}
.header-action:hover,
.header-action.is-active {
  color: var(--el-menu-hover-text-color);
}
</style>
