<template>
  <el-row :gutter="24">
    <el-col :span="8">
      <CategoryManager :show-sort="false" />
    </el-col>
    <el-col :span="16">
      <WebsiteManager />
    </el-col>
  </el-row>
</template>

<script setup>
import CategoryManager from './CategoryManager.vue';
import WebsiteManager from './WebsiteManager.vue';
</script>
