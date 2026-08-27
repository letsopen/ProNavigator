<template>
  <el-card>
    <template #header>
      <div class="pn-card-header">
        <span>{{ panelTitle }}</span>
        <el-button
          class="action-button"
          @click="openDialog()"
        >
          新增网站
        </el-button>
      </div>
    </template>

    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="filteredWebsites"
      row-key="id"
      size="large"
    >
      <el-table-column
        label="Logo"
        width="80"
      >
        <template #default="{ row }">
          <el-avatar
            v-if="row.logo"
            :src="row.logo"
            :size="32"
          />
          <el-avatar
            v-else
            :size="32"
          >
            {{ row.websiteName.charAt(0) }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="websiteName"
        label="网站名称"
      />
      <el-table-column
        prop="url"
        label="URL"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作"
        width="160"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            @click="openDialog(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            @click="remove(row)"
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
    width="800px"
  >
    <el-form
      :model="formData"
      label-width="80px"
    >
      <el-form-item label="网站名称">
        <el-input
          v-model="formData.websiteName"
          maxlength="100"
        />
      </el-form-item>
      <el-form-item label="URL">
        <el-input v-model="formData.url" />
      </el-form-item>
      <el-form-item label="所属分类">
        <el-select v-model="formData.categoryId">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            :label="category.categoryName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Logo">
        <el-upload
          v-model:file-list="fileList"
          accept="image/*"
          :auto-upload="false"
          :limit="1"
          list-type="picture-card"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-checkbox
          v-if="editingId && formData.logo"
          v-model="formData.removeLogo"
        >
          删除当前 Logo
        </el-checkbox>
      </el-form-item>
      <el-form-item label="说明">
        <el-input
          v-model="formData.description"
          class="description-input"
          type="textarea"
          :rows="6"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="onConfirm"
      >
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, computed, nextTick, inject, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import Sortable from 'sortablejs';
import { useApi } from '../../../composables/useApi.js';


const events = inject('adminEventBus', null);

const { get, put, del } = useApi();
const categories = ref([]);
const websites = ref([]);
const loading = ref(false);
const visible = ref(false);
const editingId = ref(null);
const fileList = ref([]);
const tableRef = ref(null);


const selectedCategoryId = computed(() => events?.selectedCategoryId?.value || null);

const formData = reactive({
  websiteName: '',
  url: '',
  categoryId: null,
  description: '',
  logo: '',
  removeLogo: false,
});

const currentCategory = computed(() => {
  return categories.value.find(c => c.id === selectedCategoryId.value) || null;
});

const panelTitle = computed(() => {
  return currentCategory.value ? `网站管理：${currentCategory.value.categoryName}` : '网站管理';
});

const filteredWebsites = computed(() => {
  if (!selectedCategoryId.value) return [];
  return websites.value.filter(w => w.categoryId === selectedCategoryId.value);
});

const dialogTitle = computed(() => (editingId.value ? '编辑网站' : '新增网站'));

async function loadData() {
  loading.value = true;
  try {
    const [catRes, webRes] = await Promise.all([
      get('/api/admin/categories'),
      get('/api/admin/websites?page=1&size=1000'),
    ]);
    if (catRes.code === 0) categories.value = catRes.data;
    if (webRes.code === 0) websites.value = webRes.data.list;
    await nextTick();
    initSortable();
  } finally {
    loading.value = false;
  }
}

function initSortable() {
  const el = tableRef.value?.$el.querySelector('.el-table__body tbody');
  if (!el) return;

  Sortable.create(el, {
    animation: 150,
    onEnd: async (evt) => {
      const newData = [...filteredWebsites.value];
      const moved = newData.splice(evt.oldIndex, 1)[0];
      newData.splice(evt.newIndex, 0, moved);

      websites.value = websites.value.map(w => {
        const idx = newData.findIndex(item => item.id === w.id);
        if (idx >= 0) {
          return { ...w, displayOrder: idx + 1 };
        }
        return w;
      });

      const ids = newData.map(item => item.id);
      const res = await put(`/api/admin/categories/${selectedCategoryId.value}/websites/order`, { ids, movedId: moved.id });
      if (res.code === 0) {
        ElMessage.success('排序已保存');
        notifyAuditLogRefresh();
      } else {
        ElMessage.error(res.message);
        await loadData();
      }
    },
  });
}

watch(selectedCategoryId, () => {
  nextTick(() => {
    initSortable();
  });
});

function notifyAuditLogRefresh() {
  if (events && typeof events.refreshAuditLogs === 'function') {
    events.refreshAuditLogs();
  }
}


async function openDialog(row) {
  editingId.value = row ? row.id : null;
  formData.websiteName = row ? row.websiteName : '';
  formData.url = row ? row.url : '';
  formData.categoryId = row ? row.categoryId : (selectedCategoryId.value || categories.value[0]?.id || null);
  formData.description = row ? (row.description || '') : '';
  formData.logo = row ? row.logo : '';
  formData.removeLogo = false;
  fileList.value = row && row.logo ? [{ url: row.logo, name: 'logo' }] : [];
  visible.value = true;

}

async function onConfirm() {
  const url = editingId.value ? `/api/admin/websites/${editingId.value}` : '/api/admin/websites';
  const method = editingId.value ? 'PUT' : 'POST';

  const body = new FormData();
  body.append('websiteName', formData.websiteName);
  body.append('url', formData.url);
  body.append('categoryId', formData.categoryId);
  body.append('description', formData.description);
  body.append('removeLogo', formData.removeLogo);

  if (fileList.value.length > 0 && fileList.value[0].raw) {
    body.append('logo', fileList.value[0].raw);
  }

  const token = localStorage.getItem('nav_token');
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body,
    });
    const data = await res.json();

    if (data.code === 0) {
      ElMessage.success(dialogTitle.value + '成功');
      visible.value = false;
      await loadData();
      notifyAuditLogRefresh();
    } else {
      ElMessage.error(data.message);
    }
  } catch (err) {
    ElMessage.error('保存失败');
  }
}

async function remove(row) {
  try {
    await ElMessageBox.confirm('确定删除该网站吗？', '提示', { type: 'warning' });
  } catch {
    return;
  }

  const res = await del(`/api/admin/websites/${row.id}`);
  if (res.code === 0) {
    ElMessage.success('删除成功');
    await loadData();
    notifyAuditLogRefresh();
  } else {
    ElMessage.error(res.message);
  }
}

onMounted(loadData);
</script>

<style scoped>
.description-input {
  width: 100%;
}
</style>
