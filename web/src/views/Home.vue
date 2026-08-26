<template>
  <el-container direction="vertical">
    <el-header>
      <el-page-header
        title="ProNavigator"
        content="快速访问常用内部系统"
        @back="() => {}"
      />
    </el-header>

    <el-main>
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
            <span>{{ category.categoryName }}</span>
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
    </el-main>

    <el-footer>
      <div class="footer-content">
        <span>ProNavigator</span>
        <el-link
          type="primary"
          @click="goAdmin"
        >
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
.category-card {
  margin-bottom: 20px;
}
.website-card {
  aspect-ratio: 4 / 1;
  display: flex;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}
.website-card :deep(.el-card__body) {
  display: flex;
  width: 100%;
  padding: 0;
}
.website-logo {
  flex: 0 0 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e4e7ed;
}
.website-logo :deep(.el-avatar) {
  border-radius: 8px;
  flex-shrink: 0;
}
.website-title {
  flex: 0 0 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  box-sizing: border-box;
}
.website-title .el-text {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}
.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100%;
}
</style>
