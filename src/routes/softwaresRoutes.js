const express = require("express");
const router = express.Router();
const softwaresController = require("../controllers/softwaresController");

// 📌 Rotas para gerenciar softwares
router.get("/", softwaresController.buscarTodosSoftwares); // ✅ Agora acessível via "/softwares"
router.post("/", softwaresController.criarSoftware);
router.get("/:id", softwaresController.buscarSoftwarePorId); // ✅ Corrigido para "/softwares/:id"
router.put("/:id", softwaresController.atualizarSoftware);
router.delete("/:id", softwaresController.excluirSoftware);


// //  Rotas para gerenciar seções de software
// router.get("/softwares/:id_software/secoesSoftware", softwaresController.getSoftwareSections);
// router.post("/softwares/secoesSoftware", softwaresController.createSoftwareSection);
// 📌 Rotas para gerenciar conteúdo de software
router.get("/secoesSoftware/:id/conteudo", softwaresController.buscarConteudoPorSecaoSoftware);
router.post("/secoesSoftware/conteudo", softwaresController.criarConteudoSoftware);

module.exports = router;