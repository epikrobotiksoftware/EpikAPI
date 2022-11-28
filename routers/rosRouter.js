const express = require('express');
const authController = require("./../controllers/authController");
const rossController = require("./../controllers/rosController");



const router = express.Router();

router.post('/rosApi',
    // authController.protect,
    rossController.listenCommand);
router.post('/joystick',
    // authController.protect,
    rossController.joystick);

router.get('/battery',
    // authController.protect,
    rossController.batteryStatus
);

router.get('/robotStatus',
    // authController.protect,
    rossController.robotStatus);

router
    .route('/positionMarker')
    .get(rossController.getAllPositionMarkers)
    .post(rossController.createPositionMarker);

router
    .route('/positionMarker/:id')
    .get(rossController.getPositionMarker)
    .delete(rossController.deletePositionMarker);

router.post('/sendGoal/:id',
    rossController.sendGoal
);

module.exports = router;