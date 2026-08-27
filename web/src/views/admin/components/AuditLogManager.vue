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
      >
        <template #default="{ row }">
          {{ formatLocalTime(row.createTime) }}
        </template>
      </el-table-column>
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
import { ref, onMounted, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import { useApi } from '../../../composables/useApi.js';

const events = inject('adminEventBus');

const { get } = useApi();
const loading = ref(false);
const logs = ref([]);
const total = ref(0);
const page = ref(1);
const size = ref(20);

function formatLocalTime(value) {
  if (!value) return value;
  const iso = `${value}`.trim();
  const utcDate = iso.endsWith('Z') ? new Date(iso) : new Date(`${iso}Z`);
  if (Number.isNaN(utcDate.getTime())) return value;

  const localDate = new Date(utcDate.getTime());

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hour = String(localDate.getHours()).padStart(2, '0');
  const minute = String(localDate.getMinutes()).padStart(2, '0');
  const second = String(localDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

async function loadLogs() {
  loading.value = true;
  try {
    const res = await get(`/api/admin/audit-logs?page=${page.value}&size=${size.value}`);
    if (res.code === 0) {
      logs.value = res.data.list;
      total.value = res.data.total;
    } else {
      ElMessage.error(res.message || '加载审计日志失败');
    }
  } catch (err) {
    ElMessage.error('加载审计日志失败');
  } finally {
    loading.value = false;
  }
}

watch(() => events?.refreshSignal?.value, () => {
  loadLogs();
}, { immediate: true });

onMounted(loadLogs);
</script>

<style scoped>
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
