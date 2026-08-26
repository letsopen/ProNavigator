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
                  <el-text truncated>
                    {{ website.websiteName }}
                  </el-text>
                </div>
                <el-space>
                  <el-link
                    type="primary"
                    @click.stop="openWebsite(website.url)"
                  >
                    访问网站
                  </el-link>
                  <el-link
                    type="info"
                    @click.stop="goDetail(website.id)"
                  >
                    详情
                  </el-link>
                </el-space>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-main>

    <el-footer>ProNavigator</el-footer>
  </el-container>
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
.category-card {
  margin-bottom: 20px;
}
.website-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
</style>
