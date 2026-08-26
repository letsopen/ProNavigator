<template>
  <div class="home-container">
    <el-header class="home-header">
      <div class="header-inner">
        <h1>ProNavigator</h1>
        <p>快速访问常用内部系统</p>
      </div>
    </el-header>

    <main class="main-content">
      <el-empty
        v-if="empty"
        description="暂无导航内容，请联系管理员"
      />

      <div v-else>
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-block"
        >
          <h2 class="category-title">
            {{ category.categoryName }}
          </h2>
          <el-row :gutter="16">
            <el-col
              v-for="website in category.websites"
              :key="website.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <el-card
                class="website-card"
                shadow="hover"
                @click="openWebsite(website.url)"
              >
                <div class="website-header">
                  <el-avatar
                    v-if="website.logo"
                    :src="website.logo"
                    :size="40"
                  />
                  <el-avatar
                    v-else
                    :size="40"
                  >
                    {{ website.websiteName.charAt(0) }}
                  </el-avatar>
                  <span class="website-name">{{ website.websiteName }}</span>
                </div>
                <div class="website-actions">
                  <el-button
                    type="primary"
                    link
                    @click.stop="openWebsite(website.url)"
                  >
                    访问网站
                  </el-button>
                  <el-button
                    link
                    @click.stop="goDetail(website.id)"
                  >
                    详情
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </main>

    <footer class="home-footer">
      <p>ProNavigator</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
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

function goDetail(id) {
  router.push(`/website/${id}`);
}

onMounted(loadHomeData);
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}
.home-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  height: auto;
  padding: 24px 0;
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
.home-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
}
.home-header p {
  margin: 0;
  color: #606266;
}
.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
.category-block {
  margin-bottom: 32px;
}
.category-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #409eff;
}
.website-card {
  cursor: pointer;
  margin-bottom: 16px;
}
.website-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.website-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.website-actions {
  display: flex;
  gap: 8px;
}
.home-footer {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  margin-top: 48px;
  padding: 16px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>
