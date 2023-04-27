const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const auth = require('../util/auth');

const router = express.Router();

const gaiaController = require('../controllers/gaia.controller');


//Get routes

router.get('/login', gaiaController.getLogin);
router.get('/', auth, gaiaController.getProjects);
router.get('/project/:prj', auth, gaiaController.getProject);
router.get('/tasks/:epc', auth, gaiaController.getTasks);
router.get('/users', auth, gaiaController.getUsers);
router.get('/dashboard', auth, gaiaController.getDashboard);
router.get('/import/:result', auth, gaiaController.getImport);


//Post routes
router.post('/import',auth,gaiaController.postImport);
router.post('/submit',auth,gaiaController.postImport);
router.post('/project',auth,gaiaController.postEpicsDB);
router.post('/',auth,gaiaController.postProject);


router.get('/test',gaiaController.processCsv);


module.exports = router;