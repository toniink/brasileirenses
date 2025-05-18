export const login = async (email, senha) => {
  const response = await fetch('http://localhost:3000/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Credenciais inválidas');
  }

  const data = await response.json();
  
  // Armazena token e dados do usuário
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  
  return data.usuario;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  // Opcional: chamar endpoint de logout no backend se necessário
  // fetch('http://localhost:3000/usuarios/logout', { method: 'POST' });
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('usuario');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};