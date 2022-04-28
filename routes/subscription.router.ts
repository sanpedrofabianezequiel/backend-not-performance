import {Request, Response, Router} from 'express';
import { check } from 'express-validator';
import { subscriptionByIdAndTypeController, subscriptionController,subscriptionAllController,unsubscriptionController } from '../controllers/subscription.controller';
import { validarCampos } from '../middlewares';

const router = Router();

router.post('/subscriptions',[
    check('type',"Type is required").not().isEmpty(),
    validarCampos
],subscriptionController);
router.delete('/subscriptions/:id/:type',[],subscriptionByIdAndTypeController);
router.get('/unsubscriptions/:email',[],unsubscriptionController);

router.get('/subscriptions',[],subscriptionAllController);

export {
    router,
}

