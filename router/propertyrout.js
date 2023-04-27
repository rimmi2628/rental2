const express = require('express');
const router = express.Router();
const propertycontrol= require('../controller/propertycontroller');
const auth=require('../middelware/auth')
const upload=require('../middelware/multer');
// const multer=require('multer');


// const multerstorage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"public");
//     },
//     filename:(req,file,cb)=>{
//         const ext=file.mimetype.split("/")[1];
//         cb(null,`${file.fieldname}-${Date.now()}.${ext}`);
//     },
// });
// const upload=multer({
//     storage:multerstorage
// });


router.post('/property',auth ,propertycontrol.postproperty);
router.post('/image',auth,upload.array('file_name'),propertycontrol.postimage);
router.post('/icon',auth,upload.array('icon'),propertycontrol.postamenity);
// router.post('/property_image',auth,propertycontrol.postpropertyimage);
// router.get('/propertydetail',auth,propertycontrol.postdetail);
// router.post('/propertyamenity',auth,propertycontrol.postproamenities);
router.delete('/imagedelete',auth,propertycontrol.postdelete);
router.get('/amenity',auth,propertycontrol.getamenity);
router.post('/question',auth,propertycontrol.postquestion);
router.get('/getquestion',auth,propertycontrol.getquestion);
router.put('/update',auth,propertycontrol.updateproperty);
router.delete('/delete',auth,propertycontrol.delpro);
router.post('/filteruser',propertycontrol.filteruser);
router.post('/proapplicant',auth,propertycontrol.proapplicant);
router.get('/prolocation',propertycontrol.prolocation);
// router.get('/getquessub',propertycontrol.getquestionsubmit);
module.exports=router;