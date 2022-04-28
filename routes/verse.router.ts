import {Request, Response, Router} from 'express';
import { check } from 'express-validator';
import { deleteVerseByIdController, getBooksChaptersController, getVerseRandomController, getVerseWithImagesController, getVersesController, getVersesIdentifierController, getVersesRouterInfoController, nextVerseController, postVersesController, postVerseSearchController, putVerseByIdController, verseIdentifierImagesController } from '../controllers/verse.controller';
import { validarCampos } from '../middlewares';
import multer from 'multer';
const upload =  multer({dest:'uploads/'})
const router = Router();

router.post('/verses',[
    check('book_id',"book_id is required").not().isEmpty(),
    check('chapter',"chapter is required").not().isEmpty(),
    check('number','number is required').not().isEmpty(),
    check('text','text is required').not().isEmpty(),
    validarCampos
],postVersesController);
//router.get('/verses/router_info',[],getVersesRouterInfoController);
//router.get('/verses',[],getVersesController);
router.get('/verses/:identifier',[],getVersesIdentifierController);
router.get('/bookschapters/verses/:identifier',[],getBooksChaptersController);
router.delete('/verses/:id',[],deleteVerseByIdController);
router.put('/verses/:id',[
    check('book_id',"book_id is required").not().isEmpty(),
    check('chapter',"chapter is required").not().isEmpty(),
    check('number','number is required').not().isEmpty(),
    check('text','text is required').not().isEmpty(),
    validarCampos
],putVerseByIdController);
//router.get('/verses/random/random',[],getVerseRandomController);
router.post('/verses/search',[
    check('text','text is required').not().isEmpty(),
    validarCampos
],postVerseSearchController);
//router.get('/next_verses',[],nextVerseController);
router.put('/verses/:identifier/images',[upload.single('image')],verseIdentifierImagesController);
router.get('/verses/with/images',[],getVerseWithImagesController);

export {
    router,
}

