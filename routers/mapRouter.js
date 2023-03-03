const express = require('express');
const mapController = require('../controllers/mapController');
var bodyParser = require('body-parser');

const router = express.Router();

router.get('/getMap', mapController.getMap);
router.post('/startMap', mapController.startMap);
router.get('/stopMap', mapController.stopMap);
router.get('/saveMap', mapController.saveMap);
router.post('/pauseMap', mapController.pauseMap);
router.get('/downloadMap', mapController.downloadMap);
router.get('/mapStatus', mapController.mapStatus);
router.get('/mapUpdate', mapController.mapUpdate);
router.post(
  '/mapConvert',
  bodyParser.json({ limit: '5mb' }),
  mapController.mapConvert
);

module.exports = router;
