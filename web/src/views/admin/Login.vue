<template>
  <div class="login-page">
    <div class="login-wrapper">
      <el-card
        class="login-card"
        shadow="never"
      >
        <template #header>
          <div class="login-header">
            <el-avatar
              :size="48"
              shape="square"
              class="login-logo"
            >
              P
            </el-avatar>
            <h1 class="login-title">
              ProNavigator
            </h1>
            <p class="login-subtitle">
              管理员登录
            </p>
          </div>
        </template>
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
        >
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              class="login-input"
              size="large"
              placeholder="用户名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              class="login-input"
              size="large"
              type="password"
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item class="submit-item">
            <el-button
              class="login-button"
              size="large"
              type="primary"
              :loading="submitting"
              @click="onSubmit"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="login-footer">
      <el-link @click="goHome">
        返回首页
      </el-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
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

onMounted(() => {
  const token = localStorage.getItem('nav_token');
  if (token) {
    router.push('/admin/categories');
  }
});

function goHome() {
  router.push('/');
}

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
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #18181b 0%, var(--pn-bg-base) 70%);
}
.login-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}
.login-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--pn-bg-card);
  border: 1px solid var(--pn-border-color);
}
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.login-logo {
  background: var(--pn-bg-elevated);
  color: var(--pn-accent);
  font-weight: 700;
  border-radius: 10px;
  margin-bottom: 16px;
}
.login-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--pn-text-primary);
}
.login-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--pn-text-muted);
}
.login-footer {
  padding: 16px;
  text-align: center;
}
.login-input :deep(.el-input__wrapper) {
  padding: 0;
  border-radius: 8px;
}
.login-input :deep(.el-input__inner) {
  text-align: center;
  font-weight: 700;
}
.login-button {
  width: 100%;
  border-radius: 8px;
  background-color: #ffffff;
  border-color: #ffffff;
  color: #09090b;
  font-weight: 700;
}
.login-button:hover {
  background-color: #e4e4e7;
  border-color: #e4e4e7;
  color: #09090b;
}
.submit-item :deep(.el-form-item__content) {
  justify-content: center;
}
</style>
