const express = require('express');
const imageController = require('./../controllers/imageController');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });



const router = express.Router();
router.get('/getImage',
    imageController.getImage
);

router.post('/uploadImage',
    // upload.single('userImage'),
    imageController.config,
    imageController.uploadImage)
module.exports = router;
