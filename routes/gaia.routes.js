const express = require('express');

const router = express.Router();

const gaiaController = require('../controllers/gaia.controller');


//Get routes
router.get('/login', gaiaController.getLogin);
router.get('/', gaiaController.getProjects);
router.get('/project', gaiaController.getProject);
router.get('/project/tasks', gaiaController.getTasks);
router.get('/users', gaiaController.getUsers);
router.get('/dashboard', gaiaController.getDashboard);
router.get('/import', gaiaController.getImport);
router.post('/import/submit',gaiaController.getImport);

module.exports = router;