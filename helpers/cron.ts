
import sleep from 'sleep-promise';
import {
    createStringFromDate,
    getNextDate
} from './date'
import moment from 'moment';
import {
    sendVersesPlanReading,
    sendDailyVerse
} from './email';

import {
    sendSMS
} from './sms';
import { getRepository, MoreThanOrEqual } from 'typeorm';
import { IReadingPlans } from '../entity/reading_plan.entity';
import { IVerses } from '../entity/Verse.entity';
import { groupVersesByBookChapter} from './verse.helper';
import { IDailys } from '../entity/daily_verse.entity';
import { ISubscriptions } from '../entity/subscription.entity';
import { IResponseSQLSubscription, enumType } from '../interfaces/IResponseSubscription';
import { IGeneric } from '../entity/generic.entity';
import { IResponseSQLVerse, IResponseVerse } from '../interfaces/IResponseVerseTopic';

export const sendReadingPlanMessages = async () => {

    const todayDate = createStringFromDate(Date.now());
    const countReadingPlans = await getRepository(IReadingPlans).count({
        next_date: todayDate
    });

    const limit = 10;
    const pages = ((count, limit) => {
        const div = count / limit;
        let pages = div.toFixed(0);
        if (count % limit > 0 && count % limit <5) {
            pages = (div + 1).toFixed(0);
        }
        return pages;
    })(countReadingPlans,limit);

    for (let i = 1; i <= Number(pages); i++) {
        const offset = (i - 1) * limit;
        const readingPlans :IReadingPlans[] = await getRepository(IReadingPlans).find({
            where: {
                next_date: todayDate
            },
            take: offset
        });

        console.log(readingPlans)
        
        readingPlans.forEach(async (plan) => {

            const nextDate = getNextDate(todayDate, plan.days);
            const limitVerses = plan.amount_verses_per_day;
            const offsetVerses = Number(plan.amount_days_delivered) * Number(plan.amount_verses_per_day);
            
            const data :IResponseSQLVerse[] = await getRepository(IGeneric).query(`
            SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
                   (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
                  (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
                FROM i_verses AS V
                INNER JOIN i_books as B ON V.book_id = B.id
                LEFT JOIN  i_verses_have_topics AS VHT ON V.id = VHT.verse_id
                LEFT JOIN  i_topics AS T ON VHT.topic_id = T.id
                LIMIT ${offsetVerses},${limitVerses}
            `) as IResponseSQLVerse[]; 

            console.log(data)
            
            const verses :IResponseVerse[]=data.map((resp:IResponseSQLVerse)=>{
                return {
                  id:resp.id,
                  book_id:resp.book_id,
                  chapter:resp.chapter,
                  number:resp.number,
                  slug:resp.slug,
                  text:resp.text,
                  url_image:resp.url_image,
                  book:{
                    id:resp.b_id,
                    name:resp.b_name,
                    number:resp.b_number,
                    number_chapters:resp.b_number_chapters,
                    slug:resp.b_slug,
                    testament:resp.b_testament
                  },
                  topics:{
                    id:resp.t_id,
                    enabled:resp.t_enabled,
                    name:resp.t_name,
                    slug:resp.t_slug,
                    url_image:resp.t_url_image
                  }
                }
            });

            let versesArray = groupVersesByBookChapter(verses);
            // Send email
            const progessPercentage = (((Number(plan.amount_days_delivered) * Number(plan.amount_verses_per_day)) / 32000) * 100).toFixed(2);
            const subject = `Your Bible Verse of the Days - ${progessPercentage}% Progress Bible Reading Plan`;
            const listDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayNames = Array.from(plan.days).map((d:any) => listDayNames[d]);
            sendVersesPlanReading(plan.email, subject, versesArray, {
                startDate: moment(plan.start_date).format('MMMM DD, YYYY'),
                endDate: moment(plan.end_date).format('MMMM DD, YYYY'),
                days: dayNames.join(',')
            });

            // Update record
            plan.next_date = createStringFromDate(nextDate);
            plan.amount_days_delivered++;
            await getRepository(IReadingPlans).update({id:plan.id},{
                ...plan,
            }) 
        });
        await sleep(2000);
    }
};

export const sendDailyVerses = async () => {
    const response :IResponseSQLSubscription[]= await getRepository(IGeneric).query(`
    SELECT (V.text) AS text,(B.name) AS name,(V.chapter) AS chapter,(V.number) AS number
        FROM i_dailys AS D
            INNER JOIN i_verses AS V ON D.verse_id = V.id
                INNER JOIN i_books AS B ON V.book_id = B.id
                    WHERE D.date >= DATE(NOW())
                        ORDER BY  D.date ASC
                            LIMIT 1
    `);
    const subscriptions :ISubscriptions[] = await getRepository(ISubscriptions).find({}) as ISubscriptions[];
    for(let i=0;i<subscriptions.length;i++){
     switch (subscriptions[i].type) {
         case enumType.ONLY_SMS:
            await sendSMS(subscriptions[i].phone, `${response[0].text} - BibleVerses`)
            break;
         case enumType.ONLY_EMAIL:
            await sendDailyVerse(subscriptions[i].email, "Bible Verse of the Day", response[0]);
            break;
         case enumType.EMAIL_SMS:
            await sendDailyVerse(subscriptions[i].email, "Bible Verse of the Day", response[0]);
            await sendSMS(subscriptions[i].phone, `${response[0].text} - BibleVerses`);
            break;
         default:
             break;
     }
    }
    await sleep(2000);
};
