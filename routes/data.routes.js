const express = require('express');

const router = express.Router();

const dataController = require('../controllers/data.controller');

// Ruta para obtener datos de estatus del proyecto
router.get('/project/status/:idProject', dataController.getStatus);

router.get('/project/epics/:idProject', dataController.getProjectEpics);

router.get('/project/epic/status/:idEpic', dataController.getStatusEpic);

router.get('/project/title/:idProject', dataController.getNotTitle);

router.get('/project/area/:idProyecto', dataController.getArea);

module.exports = router;