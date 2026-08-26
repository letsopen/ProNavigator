<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <t-card
      :bordered="true"
      class="w-full max-w-md shadow"
    >
      <h1 class="text-2xl font-bold text-center mb-6">
        管理员登录
      </h1>
      <t-form
        ref="form"
        :data="formData"
        :rules="rules"
        @submit="onSubmit"
      >
        <t-form-item
          label="用户名"
          name="username"
        >
          <t-input
            v-model="formData.username"
            placeholder="请输入用户名"
          />
        </t-form-item>
        <t-form-item
          label="密码"
          name="password"
        >
          <t-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
          />
        </t-form-item>
        <t-form-item>
          <t-button
            theme="primary"
            type="submit"
            block
            :loading="submitting"
          >
            登录
          </t-button>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';

const router = useRouter();
const form = ref(null);
const submitting = ref(false);
const formData = reactive({ username: '', password: '' });

const rules = {
  username: [{ required: true, message: '用户名不能为空', type: 'error' }],
  password: [{ required: true, message: '密码不能为空', type: 'error' }],
};

async function onSubmit({ validateResult }) {
  if (validateResult !== true) return;

  submitting.value = true;
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.code === 0) {
      localStorage.setItem('nav_token', data.data.token);
      MessagePlugin.success('登录成功');
      router.push('/admin/categories');
    } else {
      MessagePlugin.error(data.message);
    }
  } catch (err) {
    MessagePlugin.error('登录失败');
  } finally {
    submitting.value = false;
  }
}
</script>
