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

const route = useRoute();

const activeTab = computed(() => {
  const tab = route.query.tab;
  if (tab === 'content' || tab === 'audit-logs') return tab;
  return 'content';
});

const refreshSignal = ref(0);
const refreshAuditLogs = () => {
  refreshSignal.value++;
};

provide('adminEventBus', {
  refreshSignal: readonly(refreshSignal),
  refreshAuditLogs,
});
</script>
