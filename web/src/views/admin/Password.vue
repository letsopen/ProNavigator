<template>
  <Layout>
    <t-card
      :bordered="true"
      title="修改密码"
      class="max-w-xl"
    >
      <t-form
        ref="form"
        :data="formData"
        :rules="rules"
        @submit="onSubmit"
      >
        <t-form-item
          label="旧密码"
          name="oldPassword"
        >
          <t-input
            v-model="formData.oldPassword"
            type="password"
            placeholder="请输入旧密码"
          />
        </t-form-item>
        <t-form-item
          label="新密码"
          name="newPassword"
        >
          <t-input
            v-model="formData.newPassword"
            type="password"
            placeholder="请输入新密码"
          />
        </t-form-item>
        <t-form-item
          label="确认新密码"
          name="confirmPassword"
        >
          <t-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
          />
        </t-form-item>
        <t-form-item>
          <t-button
            theme="primary"
            type="submit"
            :loading="submitting"
          >
            保存
          </t-button>
        </t-form-item>
      </t-form>
    </t-card>
  </Layout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import Layout from './Layout.vue';
import { useApi } from '../../composables/useApi.js';

const { put } = useApi();
const form = ref(null);
const submitting = ref(false);
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const rules = {
  oldPassword: [{ required: true, message: '旧密码不能为空', type: 'error' }],
  newPassword: [{ required: true, message: '新密码不能为空', type: 'error' }],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', type: 'error' },
    {
      validator: (val) => {
        if (!val) return { result: true };
        return val === formData.newPassword ? { result: true } : { result: false, message: '两次输入的密码不一致', type: 'error' };
      },
    },
  ],
};

async function onSubmit({ validateResult }) {
  if (validateResult !== true) return;

  if (formData.newPassword !== formData.confirmPassword) {
    MessagePlugin.error('两次输入的密码不一致');
    return;
  }

  submitting.value = true;
  try {
    const res = await put('/api/admin/password', {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    if (res.code === 0) {
      MessagePlugin.success('密码修改成功，请重新登录');
      localStorage.removeItem('nav_token');
      window.location.href = '/admin/login';
    } else {
      MessagePlugin.error(res.message);
    }
  } catch (err) {
    MessagePlugin.error('修改失败');
  } finally {
    submitting.value = false;
  }
}
</script>
