import fs from 'fs';
import moment from 'moment';
import Mustache from 'mustache';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { ISubscriptions } from '../entity/subscription.entity';
import { getRepository } from 'typeorm';
dotenv.config()
export const sendWelcomeSubscription = async (email:string, verse:any) => {
    
  
    const template = await fs.readFileSync(`${__dirname}/utils/email_templates/welcome.html`,'utf-8');
  
    const renderedHtml = Mustache.render(template!, {
        verse,
        unsubscribe: email
    });


    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    const msg = {
        to: email,
        from: {
            name: 'Bibleverses.net',
            email: process.env.SENDGRID_FROM!
        },
        subject: 'Your Subscribed Successfully',
        text: 'Welcome to Your Daily Bible Verse',
        html: renderedHtml
    }
    sgMail
        .send(msg!)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

};

export const sendCreationReadingPlan = async (email:string, startDate:any, endDate:any, days:any) => {
    const template = await fs.readFileSync(`${__dirname}/utils/email_templates/creation_reading_plan.html`, 'utf-8');

    const listDayNames :string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNames = days.map((d:any) => listDayNames[d]);

    const renderedHtml = Mustache.render(template, {
        email,
        startDate: moment(startDate).format('MMMM DD, YYYY'),
        endDate: moment(endDate).format('MMMM DD, YYYY'),
        days: dayNames.join(','),
        unsubscribe: email
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    const msg = {
        to: email,
        from: {
            name: 'Bibleverses.net',
            email: process.env.SENDGRID_FROM!
        },
        subject: 'You verses for today',
        text: `You have created your reading plan successfully.`,
        html: renderedHtml
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email reading_plan sent')
        })
        .catch((error) => {
            console.error(error)
        })

};


export const sendContactMessage = (email :string, name:string, phone:string, subject:any, message:any) => {

    const template = `
    <h2>A new contact message has arrived</h2>

    <ul>
        <li><b>Name</b>: {{name}}</li>
        <li><b>Email</b>: {{email}}</li>
        <li><b>Phone</b>: {{phone}}</li>
        <li><b>Subject</b>: {{subject}}</li>
        <li><b>Message</b>: {{message}}</li>
    </ul>
    `;

    const renderedHtml = Mustache.render(template, {
        name,
        email,
        phone,
        subject,
        message
    });

   

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    const msg = {
        to: process.env.SENDGRID_FROM!,
        from: process.env.SENDGRID_FROM!,
        subject: subject,
        text: renderedHtml,
        html: renderedHtml
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

};

export const sendVersesPlanReading = async (email:string, subject:any, versesGroupedByChapterBook:any, planInfo:any) => {

    console.log(email, subject, versesGroupedByChapterBook, planInfo)
    
    const template = await fs.readFileSync(`${__dirname}/utils/email_templates/daily_reading_plan.html`, 'utf-8');
    const renderedHtml = Mustache.render(template, {
        versesGroupedByChapterBook,
        planInfo,
        unsubscribe: email
    });


    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM!,
        subject: subject,
        text: `Welcome to the Bible Reading Plan.`,
        html: renderedHtml
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
};

export const sendDailyVerse = async (listEmailToSend:any, subject:any, verse:any) => {

    console.log(verse)
    const template = await fs.readFileSync(`${__dirname}/utils/email_templates/daily_verse.html`, 'utf-8');
    const renderedHtml = Mustache.render(template, verse);

   
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    const msg = {
        to: listEmailToSend,
        from: {
            name: 'Bibleverses.net',
            email: process.env.SENDGRID_FROM!
        },
        subject: subject,
        text: `Bible verse of the day`,
        html: renderedHtml
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

};
