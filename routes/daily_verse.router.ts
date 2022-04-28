import {Request, Response, Router} from 'express';
import { dailyVerseController } from '../controllers/daily-verse.controller';

const router = Router();

router.get('/dailyverses',[],dailyVerseController);

export {
    router,
}


