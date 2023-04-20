const express = require('express');

const router = express.Router();

const dataController = require('../controllers/data.controller');

// Ruta para obtener datos de estatus del proyecto
router.get('/project/status/:idProyecto', dataController.getStatus);

router.get('/project/title/:idProyecto', dataController.getNotTitle);

module.exports = router;