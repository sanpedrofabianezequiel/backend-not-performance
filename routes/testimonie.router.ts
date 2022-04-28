import {Request, Response, Router} from 'express';
import { check } from 'express-validator';
import { getTestimoniesController, postTestimoniesController } from '../controllers/testimony.controller';
import { validarCampos } from '../middlewares';

const router = Router();

router.post('/testimonies',[
    check('title',"title is required").not().isEmpty(),
    check('content',"content is required").not().isEmpty(),
    validarCampos
],postTestimoniesController);
router.get('/testimonies',[],getTestimoniesController);

export {
    router,
}

