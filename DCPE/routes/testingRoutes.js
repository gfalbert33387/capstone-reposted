const express = require('express');
const router = express.Router();
const testingController = require('../controllers/testingController');

router.get('/chase', testingController.chase);
router.get('/greg', testingController.greg);
router.get('/jakob', testingController.jakob);
router.get('/lauren', testingController.lauren);
router.get('/mustafa', testingController.mustafa);
router.get('/fiona', testingController.fiona);

module.exports = router;
