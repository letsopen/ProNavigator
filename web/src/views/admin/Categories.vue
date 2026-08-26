<template>
  <Layout>
    <t-card
      :bordered="true"
      title="分类管理"
    >
      <template #actions>
        <t-button
          theme="primary"
          @click="openDialog()"
        >
          新建分类
        </t-button>
      </template>

      <t-table
        row-key="id"
        :data="categories"
        :columns="columns"
        :loading="loading"
        drag-sort="row"
        @drag-sort="onDragSort"
      >
        <template #action="{ row }">
          <t-space>
            <t-button
              theme="primary"
              variant="text"
              @click="openDialog(row)"
            >
              编辑
            </t-button>
            <t-button
              theme="danger"
              variant="text"
              @click="remove(row)"
            >
              删除
            </t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="visible"
      :header="dialogTitle"
      @confirm="onConfirm"
    >
      <t-input
        v-model="formData.categoryName"
        placeholder="请输入分类名称"
        maxlength="50"
      />
    </t-dialog>
  </Layout>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import Layout from './Layout.vue';
import { useApi } from '../../composables/useApi.js';

const { get, post, put, del } = useApi();
const loading = ref(false);
const categories = ref([]);
const visible = ref(false);
const editingId = ref(null);
const formData = reactive({ categoryName: '' });

const dialogTitle = computed(() => (editingId.value ? '编辑分类' : '新建分类'));

const columns = [
  { colKey: 'categoryName', title: '分类名称' },
  { colKey: 'displayOrder', title: '排序', width: 80 },
  { colKey: 'action', title: '操作', width: 160 },
];

async function loadCategories() {
  loading.value = true;
  try {
    const res = await get('/api/admin/categories');
    if (res.code === 0) {
      categories.value = res.data;
    }
  } finally {
    loading.value = false;
  }
}

function openDialog(row) {
  editingId.value = row ? row.id : null;
  formData.categoryName = row ? row.categoryName : '';
  visible.value = true;
}

async function onConfirm() {
  const name = formData.categoryName.trim();
  if (!name) {
    MessagePlugin.error('分类名称不能为空');
    return;
  }

  const res = editingId.value
    ? await put(`/api/admin/categories/${editingId.value}`, { categoryName: name })
    : await post('/api/admin/categories', { categoryName: name });

  if (res.code === 0) {
    MessagePlugin.success(dialogTitle.value + '成功');
    visible.value = false;
    await loadCategories();
  } else {
    MessagePlugin.error(res.message);
  }
}

async function remove(row) {
  if (!confirm('确定删除该分类吗？')) return;
  const res = await del(`/api/admin/categories/${row.id}`);
  if (res.code === 0) {
    MessagePlugin.success('删除成功');
    await loadCategories();
  } else {
    MessagePlugin.error(res.message);
  }
}

async function onDragSort({ newData }) {
  categories.value = newData;
  const ids = newData.map(item => item.id);
  const res = await put('/api/admin/categories/order', { ids });
  if (res.code === 0) {
    MessagePlugin.success('排序已保存');
  } else {
    MessagePlugin.error(res.message);
    await loadCategories();
  }
}

onMounted(loadCategories);
</script>
