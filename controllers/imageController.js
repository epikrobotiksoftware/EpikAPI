const multer = require('multer');

exports.config = ()=>{
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, './uploads/');
        },
        filename: function(req, file, cb) {
          cb(null, new Date().toISOString() + file.originalname);
        }
      });
    const upload = multer({storage: storage});
    upload.single('userImage')
}

exports.getImage = (req,res)=> {

    console.log('test image');
}
exports.uploadImage = (req,res)=> {
    try{
        
        image = req.file;
        console.log(image);
        res.status(200).json({
            status: 'success',
            message: 'Image has been uploaded inside server'
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            err
        })
    }
}