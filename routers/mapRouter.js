const express = require('express');
const mapController = require('../controllers/mapController');
const router = express.Router();

router.get('/getMap', mapController.getMap);
router.get('/startMap', mapController.startMap);
router.get('/stopMap', mapController.stopMap);
router.get('/saveMap', mapController.saveMap);
router.post('/pauseMap', mapController.pauseMap);

module.exports = router;
