import {Request, Response, Router} from 'express';
import { check } from 'express-validator';
import { deleteVersesTopicIdentifierController, getVersesTopicIdentifierController, postVersesTopicIdentifierController } from '../controllers/verse-topic.controller';
import { validarCampos } from '../middlewares';

const router = Router();

router.get('/verses/topics/:topicIdentifier',[],getVersesTopicIdentifierController);
router.post('/verses/:idVerse/topics',[],postVersesTopicIdentifierController);
router.delete('/verses/:idVerse/topics/:idTopic',[],deleteVersesTopicIdentifierController);


export {
    router,
}

