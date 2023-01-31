const express = require('express');
const mapController = require('../controllers/mapController');
const router = express.Router();

router.get('/getMap', mapController.getMap);
router.post('/startMap', mapController.startMap);
router.get('/stopMap', mapController.stopMap);
router.get('/saveMap', mapController.saveMap);
router.post('/pauseMap', mapController.pauseMap);
router.get('/downloadMap', mapController.downloadMap);
router.get('/mapStatus', mapController.mapStatus);
router.get('/mapRefresh', mapController.mapRefresh);

module.exports = router;
