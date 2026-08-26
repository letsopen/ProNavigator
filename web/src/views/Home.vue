<template>
  <el-container
    class="home-page"
    direction="vertical"
  >
    <el-header class="home-header pn-glass">
      <div class="pn-container header-inner">
        <div class="title-area">
          <h1 class="main-title">
            ProNavigator
          </h1>
          <p class="sub-title">
            快速访问常用内部系统
          </p>
        </div>
      </div>
    </el-header>

    <el-main class="main-content">
      <div class="pn-container main-inner">
        <el-empty
          v-if="empty"
          description="暂无导航内容，请联系管理员"
        />

        <div v-else>
          <el-card
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            shadow="never"
          >
            <template #header>
              <span class="category-title">{{ category.categoryName }}</span>
            </template>

            <el-row :gutter="20">
              <el-col
                v-for="website in category.websites"
                :key="website.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
              >
                <el-card
                  shadow="hover"
                  class="website-card"
                  @click="openWebsite(website.url)"
                >
                  <div class="website-logo">
                    <el-avatar
                      v-if="website.logo"
                      :src="website.logo"
                      :size="40"
                      shape="square"
                    />
                    <el-avatar
                      v-else
                      :size="40"
                      shape="square"
                    >
                      {{ website.websiteName.charAt(0) }}
                    </el-avatar>
                  </div>
                  <div class="website-title">
                    <el-text truncated>
                      {{ website.websiteName }}
                    </el-text>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-main>

    <el-footer class="home-footer pn-glass">
      <div class="pn-container footer-inner">
        <span class="footer-text">ProNavigator 内部导航系统</span>
        <el-link @click="goAdmin">
          管理后台
        </el-link>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const categories = ref([]);
const empty = ref(false);

async function loadHomeData() {
  try {
    const res = await fetch('/api/public/home');
    const data = await res.json();
    if (data.code === 0) {
      categories.value = data.data.categories;
      empty.value = data.data.empty;
    } else {
      ElMessage.error(data.message);
    }
  } catch (err) {
    ElMessage.error('加载数据失败');
  }
}

function openWebsite(url) {
  window.open(url, '_blank');
}

function goAdmin() {
  window.location.href = '/admin/login';
}

onMounted(loadHomeData);
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #18181b 0%, var(--pn-bg-base) 60%);
}
.home-header {
  height: 72px;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.main-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--pn-text-primary);
  line-height: 1.4;
}
.sub-title {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--pn-text-muted);
  line-height: 1.4;
}
.main-content {
  width: 100%;
  padding: 32px 0 80px;
  overflow-x: hidden;
}
.main-inner {
  box-sizing: border-box;
}
.category-card {
  margin-bottom: 24px;
  background-color: var(--pn-bg-card);
  border: 1px solid var(--pn-border-color);
}
.category-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--pn-text-primary);
}
.website-card {
  aspect-ratio: 4 / 1;
  display: flex;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: var(--pn-bg-elevated);
  transition: border-color 0.2s, transform 0.2s;
}
.website-card:hover {
  border-color: var(--pn-accent);
  transform: translateY(-2px);
}
.website-card :deep(.el-card__body) {
  display: flex;
  width: 100%;
  padding: 0;
  overflow: hidden;
}
.website-logo {
  flex: 0 0 25%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--pn-border-color);
  box-sizing: border-box;
}
.website-logo :deep(.el-avatar) {
  border-radius: 8px;
  flex-shrink: 0;
}
.website-title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  box-sizing: border-box;
}
.website-title .el-text {
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: var(--pn-text-secondary);
}
.home-footer {
  padding: 0;
  height: auto;
  border-top: 1px solid var(--pn-border-color);
}
.footer-inner {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-text {
  font-size: 13px;
  color: var(--pn-text-muted);
}
</style>
