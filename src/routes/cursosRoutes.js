const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const cursosContentController = require('../controllers/cursosContentController');
const cursoSoftwareController = require('../controllers/cursoSoftwareController');

// Rotas de filtros
router.get('/filtrados', (req, res) => {
    const categoriaId = req.query.categoria;
    
    if (categoriaId && isNaN(parseInt(categoriaId))) {
        return res.status(400).json({ 
            success: false,
            message: 'ID de categoria deve ser um número'
        });
    }
    
    cursosController.buscarCursosPorCategoria(req, res);
});

// Rotas de conteúdo (colocar primeiro)
router.get('/com-conteudo', cursosContentController.listCursosComConteudo);
router.get('/:id/tem-conteudo', cursosContentController.verificarConteudo);
router.delete('/:id/conteudo', cursosContentController.deleteOnlyContent);
router.put('/:id/content', cursosContentController.updateCourseContent);

// Rotas CRUD básicas
router.get('/', cursosController.buscarTodosCursos);
router.post('/', cursosController.criarCurso);
router.get('/:id', cursosController.buscarCursoPorId);
router.get('/:id/completo', cursosController.buscarCursoPorIdComSoftwares); // Nova rota com softwares
router.put('/:id', cursosController.atualizarCurso);
router.delete('/:id', cursosController.excluirCurso);

// Rotas para categorias secundárias
router.post('/:id/categorias', cursosController.adicionarCategoriasSecundarias);

// Rotas para o CMS
router.get('/:id/content', cursosController.getContentByCurso);
router.post('/conteudo/:tipo', cursosController.addContent);
router.post('/:id/sections', cursosController.createSection);
router.get('/:id/sections', cursosController.getSections);
router.delete('/content/:tipo/:id', cursosController.deleteContent);

router.get('/:id/site', cursosController.getSiteByCurso);
// ==============================================
// NOVAS ROTAS PARA ASSOCIAÇÃO COM SOFTWARES
// ==============================================

// POST - Criar nova associação individual
router.post('/:id_curso/softwares', cursoSoftwareController.associarSoftware);

// PUT - Substituir TODAS as associações do curso (atualização em massa)
router.put('/:id_curso/softwares', cursoSoftwareController.atualizarAssociacoes);

// DELETE - Remover associação específica
router.delete('/:id_curso/softwares/:id_software', cursoSoftwareController.removerAssociacaoSoftware);

// GET - Listar todos softwares do curso
router.get('/:id_curso/softwares', cursoSoftwareController.listarSoftwaresDoCurso);

// GET - Verificar se um software específico está associado ao curso
router.get('/:id_curso/softwares/:id_software/verificar', cursoSoftwareController.verificarAssociacao);



module.exports = router;