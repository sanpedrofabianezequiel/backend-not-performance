import {Request, Response, Router} from 'express';
import { check } from 'express-validator';
import { bookController, booksChapterController, booksController, booksIdentifierController, deleteBookByIdController, putBookByIdController } from '../controllers/book.controller';
import { validarCampos } from '../middlewares/validar-campos';

const router = Router();

router.post('/books',[
   check('number',"Number is required").not().isEmpty(),
   check('name',"Name is required").not().isEmpty(),
   check('testament',"Testament is required").not().isEmpty(),
   validarCampos
], bookController);
router.get('/books',[],booksController);
router.get('/books/:identifier',[],booksIdentifierController);
//router.get('/books/:book_id/chapters/:chapter',[],booksChapterController);
router.delete('/books/:id',[],deleteBookByIdController);
router.put('/books/:id',[
    check('number',"Number is required").not().isEmpty(),
    check('name',"Name is required").not().isEmpty(),
    check('testament',"Testament is required").not().isEmpty(),
    validarCampos
],putBookByIdController);

export {
    router
}


