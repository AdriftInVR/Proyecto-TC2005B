const express = require('express');

const router = express.Router();

const dataController = require('../controllers/data.controller');

// Ruta para obtener datos de estatus del proyecto

router.get('/project/epics/:idProject', dataController.getProjectEpics);

router.get('/project/status/:idProject', dataController.getStatus);

router.get('/project/epic/status/:idEpic', dataController.getStatusEpic);

router.get('/project/title/:idProject', dataController.getNotTitle);

router.get('/project/estimate/:idProject', dataController.getEstimate);

router.get('/project/completeAP/:idProject/:start/:end', dataController.getCompletedAP);

router.get('/project/epic/completeAP/:idEpic/:start/:end', dataController.getCompletedAPEpic);


module.exports = router;