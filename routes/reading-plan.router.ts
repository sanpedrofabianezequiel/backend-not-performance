import {Request, Response, Router} from 'express';
import { check } from 'express-validator';
import { readingPlansController } from '../controllers/reading-plan.controller';
import { validarCampos } from '../middlewares';

const router = Router();

router.post('/reading_plans',[
    check('name',"Name is required").not().isEmpty(),
    check('email',"Emial is required").not().isEmpty().isEmail(),
    check('days',"Days is required").not().isEmpty(),
    check('start_date',"Start date is required").not().isEmpty(),
    check('marked_days',"Marked days is required").not().isEmpty(),
    validarCampos
],readingPlansController);

export {
    router,
}

