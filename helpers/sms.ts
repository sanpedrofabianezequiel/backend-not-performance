import {Twilio}  from 'twilio'
import dotenv from 'dotenv';
dotenv.config();


const client= new Twilio (process.env.TWILIO_ACCOUND_SID!, process.env.TWILIO_AUTH_TOKEN!)

export const sendSMS = async (to:any, body:any) => {
           client.messages
           .create({
              body: body + 'Bibleverses.net' ,
              to: to, //+54 (011) 5923-8713
              from: "+12138175146",
            })
        .then(message => console.log("sms ==> enviado", message.sid))
        .catch (error =>{
            console.log("problema con el numero ==>>", error);
        });
}