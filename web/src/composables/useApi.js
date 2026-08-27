function getToken() {
  return localStorage.getItem('nav_token');
}

export function useApi() {
  async function request(url, options = {}) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('nav_token');
      window.location.href = '/admin/login';
      return Promise.reject(new Error('登录已失效，请重新登录'));
    }
    return res.json();
  }

  return {
    get(url) {
      return request(url, { method: 'GET' });
    },
    post(url, body) {
      return request(url, { method: 'POST', body: JSON.stringify(body) });
    },
    put(url, body) {
      return request(url, { method: 'PUT', body: JSON.stringify(body) });
    },
    del(url) {
      return request(url, { method: 'DELETE' });
    },
    request,
  };
}
