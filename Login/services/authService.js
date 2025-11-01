const API_URL = 'https://api-laravel-12-main-fv6pcf.laravel.cloud';

// Configuración mejorada para fetch

const fetchConfig = {
  mode: 'cors',
  credentials: 'same-origin', // Cambiar a 'same-origin' para probar
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
};

export const authService = {
  async login(email, password) {
    try {
      console.log('🔗 Conectando a:', `${API_URL}/api/login`);
      
      // Intentar sin credentials primero
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Login exitoso:', data);
      
      // Guardar token y datos del usuario
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        console.warn('⚠️ No token received in response');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error completo en login:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Problema de CORS o conexión: ${error.message}`);
      }
      
      throw error;
    }
  },

  // ... (el resto de los métodos se mantienen igual)
  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible');
      
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener el perfil`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getProfile:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      this.clearAuthData();
      
    } catch (error) {
      console.error('Error en logout:', error);
      this.clearAuthData();
    }
  },

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
};