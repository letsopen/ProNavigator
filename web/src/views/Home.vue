<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-900">
          ProNavigator
        </h1>
        <p class="text-gray-600 mt-1">
          快速访问常用内部系统
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <t-empty
        v-if="empty"
        description="暂无导航内容，请联系管理员"
      />

      <div v-else>
        <div
          v-for="category in categories"
          :key="category.id"
          class="mb-8"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4 pl-3 border-l-4 border-blue-500">
            {{ category.categoryName }}
          </h2>
          <t-row :gutter="[16, 16]">
            <t-col
              v-for="website in category.websites"
              :key="website.id"
              :span="3"
              :md="4"
              :sm="6"
              :xs="12"
            >
              <t-card
                :bordered="true"
                hover-shadow
                class="cursor-pointer"
                @click="openWebsite(website.url)"
              >
                <template #header>
                  <div class="flex items-center">
                    <t-avatar
                      v-if="website.logo"
                      :image="website.logo"
                      shape="round"
                      size="medium"
                      class="mr-3"
                    />
                    <t-avatar
                      v-else
                      size="medium"
                      class="mr-3"
                    >
                      {{ website.websiteName.charAt(0) }}
                    </t-avatar>
                    <span class="font-medium truncate">{{ website.websiteName }}</span>
                  </div>
                </template>
                <t-space>
                  <t-button
                    theme="primary"
                    variant="text"
                    @click.stop="openWebsite(website.url)"
                  >
                    访问网站
                  </t-button>
                  <t-button
                    theme="default"
                    variant="text"
                    @click.stop="goDetail(website.id)"
                  >
                    详情
                  </t-button>
                </t-space>
              </t-card>
            </t-col>
          </t-row>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="max-w-7xl mx-auto py-4 text-center text-sm text-gray-500">
        ProNavigator
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';

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
      MessagePlugin.error(data.message);
    }
  } catch (err) {
    MessagePlugin.error('加载数据失败');
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
