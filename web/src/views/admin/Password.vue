<template>
  <Layout>
    <el-card class="password-card">
      <template #header>
        <span>修改密码</span>
      </template>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="旧密码"
          prop="oldPassword"
        >
          <el-input
            v-model="formData.oldPassword"
            type="password"
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="formData.newPassword"
            type="password"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item
          label="确认新密码"
          prop="confirmPassword"
        >
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="submitting"
            @click="onSubmit"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </Layout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
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

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('确认密码不能为空'));
  } else if (value !== formData.newPassword) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const rules = {
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
};

async function onSubmit() {
  const valid = await form.value.validate().catch(() => false);
  if (!valid) return;

  if (formData.newPassword !== formData.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }

  submitting.value = true;
  try {
    const res = await put('/api/admin/password', {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    if (res.code === 0) {
      ElMessage.success('密码修改成功，请重新登录');
      localStorage.removeItem('nav_token');
      window.location.href = '/admin/login';
    } else {
      ElMessage.error(res.message);
    }
  } catch (err) {
    ElMessage.error('修改失败');
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.password-card {
  max-width: 560px;
}
</style>
