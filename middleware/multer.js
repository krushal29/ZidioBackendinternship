// import multer from 'multer'
// import path from 'path'


// const storage=multer.diskStorage({
//     destination:function(req,file,callback){
//         callback(null,'uploads/')
//     },
//     filename:function(req,file,callback){
//         callback(null,file.originalname);
//     }
// })

// const upload=multer({storage});

// export default upload;




import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use absolute path
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'application/vnd.ms-excel'
  ) {
    callback(null, true);
  } else {
    callback(new Error('Only Excel files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
