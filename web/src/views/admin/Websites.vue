<template>
  <Layout>
    <t-card
      :bordered="true"
      title="网站管理"
    >
      <template #actions>
        <t-button
          theme="primary"
          @click="openDialog()"
        >
          新增网站
        </t-button>
      </template>

      <t-select
        v-model="filterCategory"
        class="mb-4"
        placeholder="按分类筛选"
        clearable
      >
        <t-option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
          :label="category.categoryName"
        />
      </t-select>

      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="mb-8"
      >
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ category.categoryName }}
        </h3>
        <t-table
          row-key="id"
          :data="category.websites"
          :columns="columns"
          drag-sort="row"
          @drag-sort="onDragSort($event, category.id)"
        >
          <template #logo="{ row }">
            <t-avatar
              v-if="row.logo"
              :image="row.logo"
              shape="round"
              size="small"
            />
            <t-avatar
              v-else
              size="small"
            >
              {{ row.websiteName.charAt(0) }}
            </t-avatar>
          </template>
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
      </div>
    </t-card>

    <t-dialog
      v-model:visible="visible"
      :header="dialogTitle"
      width="800px"
      @confirm="onConfirm"
    >
      <t-form
        :data="formData"
        label-width="80px"
      >
        <t-form-item label="网站名称">
          <t-input
            v-model="formData.websiteName"
            maxlength="100"
          />
        </t-form-item>
        <t-form-item label="URL">
          <t-input v-model="formData.url" />
        </t-form-item>
        <t-form-item label="所属分类">
          <t-select v-model="formData.categoryId">
            <t-option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              :label="category.categoryName"
            />
          </t-select>
        </t-form-item>
        <t-form-item label="Logo">
          <t-upload
            v-model="fileList"
            theme="image"
            accept="image/*"
            :auto-upload="false"
            :max="1"
            tips="请上传图片，最大 2MB"
          />
          <t-checkbox
            v-if="editingId && formData.logo"
            v-model="formData.removeLogo"
          >
            删除当前 Logo
          </t-checkbox>
        </t-form-item>
        <t-form-item label="说明">
          <div
            id="editor"
            style="height: 300px;"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </Layout>
</template>

<script setup>
import { ref, onMounted, reactive, computed, nextTick } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import Layout from './Layout.vue';
import { useApi } from '../../composables/useApi.js';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const { get, put, del } = useApi();
const categories = ref([]);
const websites = ref([]);
const loading = ref(false);
const visible = ref(false);
const editingId = ref(null);
const filterCategory = ref(null);
const fileList = ref([]);
let editor = null;

const formData = reactive({
  websiteName: '',
  url: '',
  categoryId: null,
  description: '',
  logo: '',
  removeLogo: false,
});

const dialogTitle = computed(() => (editingId.value ? '编辑网站' : '新增网站'));

const columns = [
  { colKey: 'logo', title: 'Logo', width: 80 },
  { colKey: 'websiteName', title: '网站名称' },
  { colKey: 'url', title: 'URL', ellipsis: true },
  { colKey: 'action', title: '操作', width: 160 },
];

const filteredCategories = computed(() => {
  return categories.value
    .map(category => ({
      ...category,
      websites: websites.value.filter(w => {
        if (filterCategory.value && w.categoryId !== filterCategory.value) return false;
        return w.categoryId === category.id;
      }),
    }))
    .filter(category => category.websites.length > 0 || !filterCategory.value);
});

async function loadData() {
  loading.value = true;
  try {
    const [catRes, webRes] = await Promise.all([
      get('/api/admin/categories'),
      get('/api/admin/websites?page=1&size=1000'),
    ]);
    if (catRes.code === 0) categories.value = catRes.data;
    if (webRes.code === 0) websites.value = webRes.data.list;
  } finally {
    loading.value = false;
  }
}

async function initEditor(value) {
  await nextTick();
  if (!editor) {
    editor = new Editor({
      el: document.getElementById('editor'),
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      height: '300px',
      initialValue: value || '',
      events: {
        change: () => {
          formData.description = editor.getMarkdown();
        },
      },
    });
  } else {
    editor.setMarkdown(value || '');
  }
}

async function openDialog(row) {
  editingId.value = row ? row.id : null;
  formData.websiteName = row ? row.websiteName : '';
  formData.url = row ? row.url : '';
  formData.categoryId = row ? row.categoryId : (categories.value[0]?.id || null);
  formData.description = row ? (row.description || '') : '';
  formData.logo = row ? row.logo : '';
  formData.removeLogo = false;
  fileList.value = row && row.logo ? [{ url: row.logo, name: 'logo' }] : [];
  visible.value = true;
  await initEditor(formData.description);
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
      MessagePlugin.success(dialogTitle.value + '成功');
      visible.value = false;
      await loadData();
    } else {
      MessagePlugin.error(data.message);
    }
  } catch (err) {
    MessagePlugin.error('保存失败');
  }
}

async function remove(row) {
  if (!confirm('确定删除该网站吗？')) return;
  const res = await del(`/api/admin/websites/${row.id}`);
  if (res.code === 0) {
    MessagePlugin.success('删除成功');
    await loadData();
  } else {
    MessagePlugin.error(res.message);
  }
}

async function onDragSort({ newData }, categoryId) {
  websites.value = websites.value.map(w => {
    const idx = newData.findIndex(item => item.id === w.id);
    if (idx >= 0) {
      return { ...w, displayOrder: idx + 1 };
    }
    return w;
  });
  const ids = newData.map(item => item.id);
  const res = await put(`/api/admin/categories/${categoryId}/websites/order`, { ids });
  if (res.code === 0) {
    MessagePlugin.success('排序已保存');
  } else {
    MessagePlugin.error(res.message);
    await loadData();
  }
}

onMounted(loadData);
</script>
