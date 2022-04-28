import { Request, Response } from "express";
//import { ReadingPlanModel } from '../entity/book.model';
import bcryptjs from "bcryptjs";
import { getRepository } from "typeorm";
import { enumStatus, IReadingPlans } from "../entity/reading_plan.entity";
import {
  createDateFromString,
  createStringFromDate,
} from "../helpers/getTodayDate";
import { sanitizeMarkedDays } from "../helpers/readingPlan";
import moment from "moment";
import { sendCreationReadingPlan } from '../helpers/email';

interface schemacreateReadingPlan {
  name?: string;
  email?: string;
  days?: string;
  start_date?: string;
  end_date?:string;
  marked_days?: number[];
}

const readingPlansController = async (req: Request, res: Response) => {
  try {
    const { name, email, days, start_date,end_date, marked_days }:schemacreateReadingPlan = req.body;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const existEmailReadingPlan = await getRepository(IReadingPlans).findOne({
      where: {
        email
      },
    });

    if (existEmailReadingPlan) {
      return res.status(409).json({
        data: null,
        message: "This email is already registered.",
      });
    }

    const markedDaysSanitized = sanitizeMarkedDays(marked_days);
    const startDate = createDateFromString(start_date);
    let endDate=null;

    if (days == "custom") {
      endDate = createDateFromString(end_date);
    } else {
      if (isNaN(Number(days)) || days == "") {
        return res.status(409).json({
          data: null,
          message:
            "Days property is not valid. Should be 'custom' or a number > 30",
        });
      }

      if (Number(days) < 30) {
        return res.status(409).json({
          data: null,
          message:
            "Days property is not valid. Should be 'custom' or a number > 30",
        });
      }
      endDate = moment(startDate).add(days, "days").toDate();
    }

    /* Validations */
    if (!markedDaysSanitized.includes(startDate.getDay())) {
      return res.status(409).json({
        data: null,
        message: "Start date does not match with marked days to read the bible",
      });
    }
    /* Validations */

    const daysPerWeek = markedDaysSanitized.length;

    const flagFirstDay: any = ((startDate) => {
      if (startDate.getDay() == 0) {
        return startDate;
      } else {
        return moment(startDate)
          .add(6 - startDate.getDay() + 1, "days")
          .toDate();
      }
    })(startDate);

    const flagLastDay: any = ((endDate) => {
      if (endDate.getDay() == 0) {
        return endDate;
      } else {
        return moment(endDate).subtract(endDate.getDay(), "days").toDate();
      }
    })(endDate);

    const numberOfWeeks = Math.round(
      (Math.round(Math.abs((flagFirstDay - flagLastDay) / oneDay)) + 1) / 7
    );

    const extraStartDays = ((startDate, flagFirstDay, markedDaysSanitized) => {
      let nextDate = startDate;
      let count = 0;

      while (nextDate < flagFirstDay) {
        if (markedDaysSanitized.includes(nextDate.getDay())) {
          count++;
        }
        nextDate = moment(nextDate).add(1, "days").toDate();
      }
      return count;
    })(startDate, flagFirstDay, markedDaysSanitized);

    const extraEndDays = ((endDate, flagLastDay, markedDaysSanitized) => {
      let nextDate = endDate;
      let count = 0;

      while (nextDate >= flagLastDay) {
        if (markedDaysSanitized.includes(nextDate.getDay())) {
          count++;
        }
        nextDate = moment(nextDate).subtract(1, "days").toDate();
      }
      return count;
    })(endDate, flagLastDay, markedDaysSanitized);

    let numberDays =
      numberOfWeeks * daysPerWeek + extraStartDays + extraEndDays;

    const daysInString = ((arrayDays) => {
      let days = "";
      arrayDays.forEach((day: any) => {
        days = `${days}${day}`;
      });
      return days;
    })(markedDaysSanitized);

    const amountVerses = await getRepository(IReadingPlans).count();
    const amountVersesPerDay = Math.round(
      Number(amountVerses) / numberDays
    );
    
    const readingPlanCreated =  getRepository(IReadingPlans).create({
      name,
      email,
      start_date: startDate,
      end_date: endDate,
      days: daysInString,
      amount_verses_per_day: amountVersesPerDay,
      status:enumStatus.PENDING,
      amount_days_delivered: 0,
      next_date: createStringFromDate(startDate),
    });

    const readingPlan =  await getRepository(IReadingPlans).save(readingPlanCreated);
    try{
      await sendCreationReadingPlan(email!, startDate, endDate, markedDaysSanitized); 
    }catch(err){
      console.log(err);
    }
    
    return res.status(200).json({
      data: readingPlan,
      message: "Book retrieved",
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      message: "Internal error",
    });
  }
};




export { readingPlansController };
