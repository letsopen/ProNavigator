<template>
  <el-container direction="vertical">
    <el-header>
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        router
      >
        <el-menu-item index="/admin/categories">
          分类管理
        </el-menu-item>
        <el-menu-item index="/admin/websites">
          网站管理
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
    </el-header>

    <el-main>
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
.flex-spacer {
  flex: 1;
}
</style>
