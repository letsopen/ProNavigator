<template>
  <div class="detail-container">
    <el-header class="detail-header">
      <div class="header-inner">
        <el-button
          text
          @click="goHome"
        >
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
      </div>
    </el-header>

    <main class="detail-main">
      <el-loading v-if="loading" />

      <el-card
        v-else-if="website"
        class="detail-card"
      >
        <div class="website-info">
          <el-avatar
            v-if="website.logo"
            :src="website.logo"
            :size="64"
          />
          <el-avatar
            v-else
            :size="64"
          >
            {{ website.websiteName?.charAt(0) }}
          </el-avatar>
          <div class="website-meta">
            <h1>{{ website.websiteName }}</h1>
            <el-link
              type="primary"
              :href="website.url"
              target="_blank"
            >
              {{ website.url }}
            </el-link>
          </div>
        </div>

        <el-divider />

        <div
          class="markdown-body"
          v-html="website.descriptionHtml"
        ></div>
      </el-card>

      <el-empty
        v-else
        description="网站不存在"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const website = ref(null);
const loading = ref(true);

function goHome() {
  router.push('/');
}

async function loadWebsite() {
  try {
    const res = await fetch(`/api/public/websites/${route.params.id}`);
    const data = await res.json();
    if (data.code === 0) {
      website.value = data.data;
    } else {
      ElMessage.error(data.message);
    }
  } catch (err) {
    ElMessage.error('加载详情失败');
  } finally {
    loading.value = false;
  }
}

onMounted(loadWebsite);
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}
.detail-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  height: auto;
  padding: 12px 0;
}
.header-inner {
  max-width: 896px;
  margin: 0 auto;
  padding: 0 24px;
}
.detail-main {
  max-width: 896px;
  margin: 0 auto;
  padding: 24px;
}
.detail-card {
  margin-bottom: 24px;
}
.website-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}
.website-meta h1 {
  margin: 0 0 8px;
  font-size: 24px;
}
.markdown-body {
  line-height: 1.6;
}
</style>
