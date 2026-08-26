<template>
  <Layout>
    <WebsiteManager v-if="activeTab === 'websites'" />
    <CategoryManager v-else-if="activeTab === 'categories'" />
    <AuditLogManager v-else />
  </Layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Layout from './Layout.vue';
import WebsiteManager from './components/WebsiteManager.vue';
import CategoryManager from './components/CategoryManager.vue';
import AuditLogManager from './components/AuditLogManager.vue';

const route = useRoute();

const activeTab = computed(() => {
  const tab = route.query.tab;
  if (tab === 'categories' || tab === 'audit-logs' || tab === 'websites') return tab;
  return 'websites';
});
</script>
