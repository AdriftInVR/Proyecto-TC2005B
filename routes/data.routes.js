const express = require('express');

const router = express.Router();

const dataController = require('../controllers/data.controller');

// Ruta para obtener datos de estatus del proyecto

router.get('/project/epics/:idProject', dataController.getProjectEpics);

router.get('/project/status/:idProject', dataController.getStatus);

router.get('/project/epic/status/:idEpic', dataController.getStatusEpic);

router.get('/project/title/:idProject', dataController.getNotTitle);

router.get('/project/estimate/:idProject', dataController.getEstimate);

/*---------------------AP proyect and epic----------------------------*/
router.get('/project/totalAPp/:idProject', dataController.getAPproyect);
router.get('/project/epic/totalAPe/:idEpic', dataController.getAPepic);
/*--------------------------------------------------------------------*/

router.get('/project/completeAP/:idProject/:start/:end', dataController.getCompletedAP);

router.get('/project/epic/completeAP/:idEpic/:start/:end', dataController.getCompletedAPEpic);

router.get('/project/area/:idProyecto', dataController.getArea);

router.get('/project/epic/area/:idEpic', dataController.getAreaEpic);

router.get('/project/burnUpLine/:idProject', dataController.burnUpLine);



router.get('/project/epic/burnUoLineE/:idEpic', dataController.burnUpLine);

module.exports = router;