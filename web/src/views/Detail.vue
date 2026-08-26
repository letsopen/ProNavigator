<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <t-button
          theme="default"
          variant="text"
          @click="goHome"
        >
          <template #icon>
            <arrow-left-icon />
          </template>
          返回首页
        </t-button>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <t-loading v-if="loading" />

      <t-card
        v-else-if="website"
        :bordered="true"
        class="shadow"
      >
        <div class="flex items-start mb-6">
          <t-avatar
            v-if="website.logo"
            :image="website.logo"
            shape="round"
            size="large"
            class="mr-4"
          />
          <t-avatar
            v-else
            size="large"
            class="mr-4"
          >
            {{ website.websiteName?.charAt(0) }}
          </t-avatar>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ website.websiteName }}
            </h1>
            <t-link
              theme="primary"
              :href="website.url"
              target="_blank"
            >
              {{ website.url }}
            </t-link>
          </div>
        </div>

        <t-divider />


        <div
          class="prose max-w-none markdown-body"
          v-html="website.descriptionHtml"
        ></div>
      </t-card>

      <t-empty
        v-else
        description="网站不存在"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';

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
      MessagePlugin.error(data.message);
    }
  } catch (err) {
    MessagePlugin.error('加载详情失败');
  } finally {
    loading.value = false;
  }
}

onMounted(loadWebsite);
</script>
