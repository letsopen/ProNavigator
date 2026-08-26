<template>
  <el-card>
    <template #header>
      <div class="pn-card-header">
        <span>审计日志</span>
      </div>
    </template>

    <el-table
      v-loading="loading"
      :data="logs"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="action"
        label="操作"
        width="180"
      />
      <el-table-column
        prop="targetType"
        label="对象类型"
        width="120"
      />
      <el-table-column
        prop="targetId"
        label="对象 ID"
        width="100"
      />
      <el-table-column
        prop="operator"
        label="操作人"
        width="140"
      />
      <el-table-column
        prop="createTime"
        label="操作时间"
      />
    </el-table>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      class="pagination"
      @change="loadLogs"
    />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApi } from '../../../composables/useApi.js';

const { get } = useApi();
const loading = ref(false);
const logs = ref([]);
const total = ref(0);
const page = ref(1);
const size = ref(20);

async function loadLogs() {
  loading.value = true;
  try {
    const res = await get(`/api/admin/audit-logs?page=${page.value}&size=${size.value}`);
    if (res.code === 0) {
      logs.value = res.data.list;
      total.value = res.data.total;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadLogs);
</script>

<style scoped>
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
