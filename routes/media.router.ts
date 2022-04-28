import {Request, Response, Router} from 'express';
import { postMediaItemsController, mediaItemsIdentifierController, getMediaItemsController } from '../controllers/media.controller';
import multer from 'multer';
const upload =  multer({dest:'uploads/'})
const router = Router();

router.post('/media_items',[upload.single('image')],postMediaItemsController);
router.delete('/media_items/:identifier',[],mediaItemsIdentifierController);
router.get('/media_items',[],getMediaItemsController);

export {
    router,
}


