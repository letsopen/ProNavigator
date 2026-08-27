<template>
  <el-card>
    <template #header>
      <div class="pn-card-header">
        <span>分类管理</span>
        <el-button
          class="action-button"
          @click="openDialog()"
        >
          新建分类
        </el-button>
      </div>
    </template>

    <el-table
      ref="tableRef"
      v-loading="loading"
      row-key="id"
      size="large"
      :data="categories"
      :row-class-name="rowClassName"
      @row-click="handleRowClick"
    >
      <el-table-column
        prop="categoryName"
        label="分类名称"
      >
        <template #default="{ row }">
          <span
            class="category-name"
            :class="{ active: selectedId === row.id }"
          >
            {{ row.categoryName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSort"
        prop="displayOrder"
        label="排序"
        width="80"
      />
      <el-table-column
        label="操作"
        width="160"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            @click.stop="openDialog(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            @click.stop="remove(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="420px"
  >
    <el-form
      :model="formData"
      label-width="80px"
    >
      <el-form-item label="分类名称">
        <el-input
          v-model="formData.categoryName"
          placeholder="请输入分类名称"
          maxlength="50"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button
        class="action-button"
        @click="onConfirm"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, computed, nextTick, inject } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Sortable from 'sortablejs';
import { useApi } from '../../../composables/useApi.js';

defineProps({
  showSort: {
    type: Boolean,
    default: true,
  },
});

const events = inject('adminEventBus', null);

const { get, post, put, del } = useApi();
const loading = ref(false);
const categories = ref([]);
const visible = ref(false);
const editingId = ref(null);
const formData = reactive({ categoryName: '' });
const tableRef = ref(null);

const selectedId = computed(() => events?.selectedCategoryId?.value || null);

const dialogTitle = computed(() => (editingId.value ? '编辑分类' : '新建分类'));

async function loadCategories() {
  loading.value = true;
  try {
    const res = await get('/api/admin/categories');
    if (res.code === 0) {
      categories.value = res.data;
      await nextTick();
      initSortable();
      ensureSelectedCategory();
    }
  } finally {
    loading.value = false;
  }
}

function ensureSelectedCategory() {
  if (!events || typeof events.selectCategory !== 'function') return;

  const list = categories.value;
  if (list.length === 0) return;

  const current = selectedId.value;
  const exists = list.some(c => c.id === current);
  if (!exists) {
    events.selectCategory(list[0].id);
  }
}

function handleRowClick(row) {
  if (events && typeof events.selectCategory === 'function') {
    events.selectCategory(row.id);
  }
}

function rowClassName({ row }) {
  return selectedId.value === row.id ? 'selected-row' : '';
}

function notifyAuditLogRefresh() {
  if (events && typeof events.refreshAuditLogs === 'function') {
    events.refreshAuditLogs();
  }
}

function initSortable() {
  const el = tableRef.value?.$el.querySelector('.el-table__body tbody');
  if (!el) return;

  Sortable.create(el, {
    animation: 150,
    onEnd: async (evt) => {
      const newData = [...categories.value];
      const moved = newData.splice(evt.oldIndex, 1)[0];
      newData.splice(evt.newIndex, 0, moved);
      categories.value = newData;

      const ids = newData.map(item => item.id);
      const res = await put('/api/admin/categories/order', { ids, movedId: moved.id });
      if (res.code === 0) {
        ElMessage.success('排序已保存');
        notifyAuditLogRefresh();
      } else {
        ElMessage.error(res.message);
        await loadCategories();
      }
    },
  });
}

function openDialog(row) {
  editingId.value = row ? row.id : null;
  formData.categoryName = row ? row.categoryName : '';
  visible.value = true;
}

async function onConfirm() {
  const name = formData.categoryName.trim();
  if (!name) {
    ElMessage.error('分类名称不能为空');
    return;
  }

  const res = editingId.value
    ? await put(`/api/admin/categories/${editingId.value}`, { categoryName: name })
    : await post('/api/admin/categories', { categoryName: name });

  if (res.code === 0) {
    ElMessage.success(dialogTitle.value + '成功');
    visible.value = false;
    await loadCategories();
    notifyAuditLogRefresh();
  } else {
    ElMessage.error(res.message);
  }
}

async function remove(row) {
  try {
    await ElMessageBox.confirm('确定删除该分类吗？', '提示', { type: 'warning' });
  } catch {
    return;
  }

  const res = await del(`/api/admin/categories/${row.id}`);
  if (res.code === 0) {
    ElMessage.success('删除成功');
    await loadCategories();
    notifyAuditLogRefresh();
  } else {
    ElMessage.error(res.message);
  }
}

onMounted(loadCategories);
</script>

<style scoped>
.category-name {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}
.category-name:hover {
  background-color: var(--pn-bg-hover);
}
.category-name.active {
  font-weight: 700;
  color: var(--pn-accent);
}
</style>
