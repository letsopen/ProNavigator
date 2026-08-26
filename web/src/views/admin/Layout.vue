<template>
  <el-container
    class="admin-layout"
    direction="vertical"
  >
    <el-header class="admin-header">
      <div class="pn-container header-inner">
        <div class="brand">
          <el-avatar
            :size="32"
            shape="square"
            class="brand-logo"
          >
            P
          </el-avatar>
          <span class="brand-name">ProNavigator</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="admin-menu"
        >
          <el-menu-item index="/admin/categories">
            分类管理
          </el-menu-item>
          <el-menu-item index="/admin/websites">
            网站管理
          </el-menu-item>
          <el-menu-item index="/admin/audit-logs">
            审计日志
          </el-menu-item>
          <div class="flex-spacer" />
          <el-menu-item
            index="/admin/password"
            @click="goPassword"
          >
            修改密码
          </el-menu-item>
          <el-menu-item
            index=""
            @click="logout"
          >
            退出登录
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <el-main class="admin-main pn-container">
      <slot />
    </el-main>

    <el-footer class="admin-footer">
      <el-link @click="goHome">
        返回首页
      </el-link>
    </el-footer>
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
  if (route.path.startsWith('/admin/audit-logs')) return '/admin/audit-logs';
  return '';
});

function goPassword() {
  router.push('/admin/password');
}

function goHome() {
  router.push('/');
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
}
.brand-logo {
  background: var(--pn-bg-elevated);
  color: var(--pn-accent);
  font-weight: 700;
  border-radius: 8px;
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
.admin-footer {
  padding: 16px;
  text-align: center;
  background: transparent;
}
.flex-spacer {
  flex: 1;
}
</style>
