import { Request, Response, Router } from "express";
import { check } from "express-validator";
import { contactController } from "../controllers/contact.controller";
import { validarCampos } from "../middlewares";

const router = Router();

router.post('/contact', [
    check('name',"Name is required").not().isEmpty(),
    check('email',"Email is required").not().isEmpty().isEmail(),
    check('message',"Message is required").not().isEmpty(),
    check('phone',"Phone is required").not().isEmpty(),
    validarCampos
], contactController);

export {
    router
}