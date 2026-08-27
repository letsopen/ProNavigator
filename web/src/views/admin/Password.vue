<template>
  <Layout>
    <el-row justify="center">
      <el-col
        :span="24"
        :md="12"
        :lg="10"
      >
        <el-card>
          <template #header>
            <span>修改密码</span>
          </template>
          <el-form
            ref="form"
            :model="formData"
            :rules="rules"
          >
            <el-form-item prop="oldPassword">
              <el-input
                v-model="formData.oldPassword"
                class="password-input"
                size="large"
                type="password"
                placeholder="旧密码"
              />
            </el-form-item>
            <el-form-item prop="newPassword">
              <el-input
                v-model="formData.newPassword"
                class="password-input"
                size="large"
                type="password"
                placeholder="新密码"
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                class="password-input"
                size="large"
                type="password"
                placeholder="确认新密码"
              />
            </el-form-item>
            <el-form-item class="submit-item">
              <el-button
                class="password-button"
                size="large"
                type="primary"
                :loading="submitting"
                @click="onSubmit"
              >
                确认修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
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
.password-input :deep(.el-input__wrapper) {
  padding: 0;
  border-radius: 8px;
}
.password-input :deep(.el-input__inner) {
  text-align: center;
  font-weight: 700;
}
.password-button {
  width: 100%;
  border-radius: 8px;
  background-color: #ffffff;
  border-color: #ffffff;
  color: #09090b;
  font-weight: 700;
}
.password-button:hover {
  background-color: #e4e4e7;
  border-color: #e4e4e7;
  color: #09090b;
}
.submit-item :deep(.el-form-item__content) {
  justify-content: center;
}
</style>
