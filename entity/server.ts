import express, { Application } from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config()
//import swaggerUI from 'swagger-ui-express';
//import * as swaggerDocuments from '../swagger.json';
import { router as routerBooks } from '../routes/books.router';
import { router as routerDailyVerse } from '../routes/daily_verse.router';
import { router as routerMedia } from '../routes/media.router';
import { router as routerReading } from '../routes/reading-plan.router';
import { router as routerSubscription } from '../routes/subscription.router';
import { router as routerTestimonie } from '../routes/testimonie.router';
import { router as routerTopics } from '../routes/topic.router';
import { router as routerVerseTopics } from '../routes/verse_topic.router';
import { router as routerVerse } from '../routes/verse.router';
import { router as routerContact } from '../routes/contact.router';


import fileUpload from 'express-fileupload';
import cron from 'node-cron';
import { sendDailyVerses, sendReadingPlanMessages } from '../helpers/cron';
import { loadBookInCache } from '../helpers/cache';

const URL = '/api';

class Server {
    private app: Application;
    private port: string | number;
    private path: {
        booksPath: string;
        dailyVersePath: string;
        mediaPath: string;
        readingPlansPath: string;
        subscriptionPath: string;
        testimoniePath: string;
        topicPath: string;
        verseTopicPath: string;
        versePath: string;
        contactPath: string;
    };
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.path = {
            booksPath: URL,
            dailyVersePath: URL,
            mediaPath: URL,
            readingPlansPath: URL,
            subscriptionPath: URL,
            testimoniePath: URL,
            topicPath: URL,
            verseTopicPath: URL,
            versePath: URL,
            contactPath: URL,
        }
        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        try {
            await createConnection({
                type: "mysql",
                host: (process.env.DATABASE_HOST!),
                port: parseInt(process.env.DATABASE_PORT!) || 3306,
                username: process.env.DATABASE_USER!,
                password: process.env.DATABASE_PASSWORD!,
                database: process.env.DATABASE_NAME!,
                entities: ["dist/entity/**/*.js"],
                synchronize: true,
                logging: true
            });
            console.log('Database On')
        } catch (error) {
            console.log(error);
        }
    }

    async middlewares() {
        const allowedOrigins = ["*", "http://127.0.0.1:3000", "http://localhost:3000", "http://localhost:8080", "http://bibleverses.net", "https://bibleverses.net", "https://admin.bibleverses.net", "https://bibleversesnet.herokuapp.com"];
        this.app.use(cors({
            origin: allowedOrigins
        }));
        this.app.use(bodyparser.urlencoded({ extended: false }))
        this.app.use(express.json());
        this.app.use(express.static('public'));
        /*this.app.use('/swagger',swaggerUI.serve,swaggerUI.setup(swaggerDocuments));*/
        try {
            //await loadBookInCache();
            cron.schedule('0 8 * * *', async () => {

                await sendReadingPlanMessages();
                console.log('0 8 * * * sending reading plan messages');
            });

            cron.schedule('0 7 * * *', async () => {

                console.log('0 7 * * * sending daily verses');
                await sendDailyVerses();
            });
        } catch (error) {
            console.log("Verso diario con problemas", error);
        }
    }
    routes() {
        this.app.use(this.path.booksPath, routerBooks);
        this.app.use(this.path.versePath, routerVerse);
        this.app.use(this.path.mediaPath, routerMedia);
        this.app.use(this.path.dailyVersePath, routerDailyVerse);
        this.app.use(this.path.readingPlansPath, routerReading);
        this.app.use(this.path.subscriptionPath, routerSubscription);
        this.app.use(this.path.testimoniePath, routerTestimonie);
        this.app.use(this.path.topicPath, routerTopics);
        this.app.use(this.path.verseTopicPath, routerVerseTopics);
        this.app.use(this.path.contactPath, routerContact);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server on in ${this.port}`);
        });
    }
}

export {
    Server
} 