import { Request, Response } from 'express';
import bcryptjs  from 'bcryptjs';
import { getRepository } from 'typeorm';
import { sendContactMessage } from '../helpers/email';
import {IContact} from "../entity/contact.entity"

const contactController = async (req: Request, res: Response) => {
    const {name,email,message, phone}=req.body
    try {

        await sendContactMessage(email, name, phone, 'Contact message', message); 
        console.log(`Sending message of contact - email:${email} name:${name} message:${message}`); 

        const newContact = getRepository(IContact).create({
            name,
            email,
            message,
            phone
        })
        const contact = getRepository(IContact).save(newContact);
    
        return res.status(200).json({ 
            data: contact,
            message: "Message was sent",
        })
    } catch (error) {
        return res.status(500).json({ 
            data: null,
            message: "Internal error",
        })
    }
}
export {
    contactController
}