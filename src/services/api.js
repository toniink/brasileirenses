// Versão simplificada usando fetch nativo
const fetchCursos = {
  listar: async () => {
    const response = await fetch('http://localhost:3000/api/cursos');
    return await response.json();
  },
  buscarPorId: async (id) => {
    const response = await fetch(`http://localhost:3000/api/cursos/${id}`);
    return await response.json();
  },
  // Adicione outros métodos conforme suas rotas
};
export default api;