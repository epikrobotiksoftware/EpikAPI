const multer = require('multer');

exports.storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './upload/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + '_'+ file.originalname);
    }
  });

exports.fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };



exports.uploadImage = (req,res)=> {
    try{
        
        image = req.file;
        console.log(image);
        res.status(200).json({
            status: 'success',
            message: 'Image has been uploaded inside server',
            path: image.path
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            err
        })
    }
}
exports.getImage = (req,res) =>{
    res.download('upload/'+req.params.path)
}