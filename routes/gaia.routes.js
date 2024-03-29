const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const auth = require('../util/auth');

const router = express.Router();

const gaiaController = require('../controllers/gaia.controller');


//Get routes

router.get('/login', gaiaController.getLogin);
router.get('/', auth, gaiaController.getProjects);
router.get('/project/:prj', auth, gaiaController.getProject);
router.get('/tasks/:prj', auth, gaiaController.getTasks);
router.get('/users', auth, gaiaController.getUsers);
router.get('/dashboard', auth, gaiaController.getDashboard);
router.get('/import/:result', auth, gaiaController.getImport);
router.get('/deletePrj/:id', auth, gaiaController.getDeletePrj)

//Post routes
router.post('/users', auth, gaiaController.postDeleteUsers);
router.post('/import',auth,gaiaController.postImport);
router.post('/',auth,gaiaController.postProject);
router.post('/project/:prj', auth, gaiaController.postEditProject)

router.get('/test',gaiaController.processCsv);


module.exports = router;