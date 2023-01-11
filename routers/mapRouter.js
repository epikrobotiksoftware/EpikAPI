const express = require('express');
const mapController = require('../controllers/mapController');
const router = express.Router();

router.get('/getMap', mapController.getMap);
router.post('/startMap', mapController.startMap);
router.get('/stopMap', mapController.stopMap);
router.get('/saveMap', mapController.saveMap);
router.post('/pauseMap', mapController.pauseMap);
router.get('/downloadMap', mapController.downloadMap);

module.exports = router;
