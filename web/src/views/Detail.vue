<template>
  <el-container direction="vertical">
    <el-header>
      <el-page-header
        title="返回首页"
        @back="goHome"
      />
    </el-header>

    <el-main>
      <el-loading v-if="loading" />

      <el-card v-else-if="website">
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
          <div>
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
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
.website-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
</style>
