<template>
  <el-container class="login-container">
    <el-card
      class="login-card"
      shadow="always"
    >
      <template #header>
        <div class="card-header">
          管理员登录
        </div>
      </template>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="submitting"
            @click="onSubmit"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const form = ref(null);
const submitting = ref(false);
const formData = reactive({ username: '', password: '' });

const rules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
};

async function onSubmit() {
  const valid = await form.value.validate().catch(() => false);
  if (!valid) return;

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
      ElMessage.success('登录成功');
      router.push('/admin/categories');
    } else {
      ElMessage.error(data.message);
    }
  } catch (err) {
    ElMessage.error('登录失败');
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.login-container {
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.login-card {
  width: 100%;
  max-width: 420px;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>
