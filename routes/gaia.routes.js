const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const auth = require('../util/auth');

const router = express.Router();

const gaiaController = require('../controllers/gaia.controller');


//Get routes

router.get('/login', gaiaController.getLogin);
router.get('/', auth, gaiaController.getProjects);
router.get('/project', auth, gaiaController.getProject);
router.get('/project/tasks', auth, gaiaController.getTasks);
router.get('/users', auth, gaiaController.getUsers);
router.get('/dashboard', auth, gaiaController.getDashboard);
router.get('/import', auth, gaiaController.getImport);


//Post routes
router.post('/submit',auth,gaiaController.postImport);


module.exports = router;