<template>
  <Layout>
    <ContentManager v-if="activeTab === 'content'" />
    <AuditLogManager v-else />
  </Layout>
</template>

<script setup>
import { computed, provide, ref, readonly } from 'vue';
import { useRoute } from 'vue-router';
import Layout from './Layout.vue';
import ContentManager from './components/ContentManager.vue';
import AuditLogManager from './components/AuditLogManager.vue';

const STORAGE_KEY = 'selectedCategoryId';

const route = useRoute();

const activeTab = computed(() => {
  const tab = route.query.tab;
  if (tab === 'content' || tab === 'audit-logs') return tab;
  return 'content';
});

const savedId = sessionStorage.getItem(STORAGE_KEY);
const selectedCategoryId = ref(savedId ? parseInt(savedId, 10) : null);

function selectCategory(id) {
  selectedCategoryId.value = id;
  if (id === null) {
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, String(id));
  }
}

const refreshSignal = ref(0);
const refreshAuditLogs = () => {
  refreshSignal.value++;
};

provide('adminEventBus', {
  refreshSignal: readonly(refreshSignal),
  refreshAuditLogs,
  selectedCategoryId: readonly(selectedCategoryId),
  selectCategory,
});
</script>
