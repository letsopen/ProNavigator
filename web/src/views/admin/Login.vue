<template>
  <div class="login-page">
    <div class="login-wrapper">
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
        >
          <el-form-item
            prop="username"
          >
            <el-input
              v-model="formData.username"
              class="login-input"
              placeholder="用户名"
            />
          </el-form-item>
          <el-form-item
            prop="password"
          >
            <el-input
              v-model="formData.password"
              class="login-input"
              type="password"
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item class="submit-item">
            <el-button
              class="login-button"
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
      <el-link
        type="primary"
        @click="goHome"
      >
        首页
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
  border-radius: 12px;
}
.card-header {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.login-footer {
  padding: 16px;
  text-align: center;
}
.submit-item :deep(.el-form-item__content) {
  justify-content: center;
}
.login-input :deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
}
.login-button {
  width: 150px;
  height: 40px;
}
</style>
