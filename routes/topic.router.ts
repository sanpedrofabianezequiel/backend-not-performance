import {Request, Response, Router} from 'express';
import { check } from 'express-validator';
import { putTopicByIdAndImageController, deleteTopicByIdController, getTopicController, getTopicIdentifierController, postTopicController, putTopicByIdController, topicBySearchController } from '../controllers/topic.controller';
import { validarCampos } from '../middlewares';
import multer from 'multer';
const upload =  multer({dest:'uploads/'})


const router = Router();

router.post('/topics',[
    check('name','Name is required').not().isEmpty(),
    validarCampos
],postTopicController);
router.get('/topics',[],getTopicController);
router.get('/topics/:identifier',[],getTopicIdentifierController);
router.delete('/topics/:id',[],deleteTopicByIdController);
router.put('/topics/:id',[],putTopicByIdController);
router.put('/topics/:id/images',[upload.single('image')],putTopicByIdAndImageController);
router.post('/topics/search',[
    check('text','Text is required').not().isEmpty(),
    validarCampos
],topicBySearchController);

export {
    router,
}

