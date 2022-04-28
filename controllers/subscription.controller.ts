import { Request, Response } from "express";
import { getRepository, MoreThanOrEqual } from "typeorm";
import { createStringFromDate } from "../helpers/getTodayDate";
import { IDailys } from "../entity/daily_verse.entity";
import bcryptjs from "bcryptjs";
import { sendWelcomeSubscription } from "../helpers/email";
import { ISubscriptions } from "../entity/subscription.entity";
import { IGeneric } from '../entity/generic.entity';
import { enumType, IResponseSQLSubscription, IResponseSubscription } from "../interfaces/IResponseSubscription";
import { sendSMS } from "../helpers/sms";


const subscriptionController = async (req: Request, res: Response) => {
  const { type, email, phone } = req.body;
  try {
    let emailValid = true;
    let phoneValid = true;
    const options :enumType[] = [enumType.EMAIL_SMS,enumType.ONLY_EMAIL,enumType.ONLY_SMS] as enumType[];
    if( !options.includes(type.toLowerCase() as enumType) ){
      return res.status(404).json({
        data: null,
        message: "Invalid format type",
      });
    }
    switch (type.toLowerCase() as enumType) {
      case enumType.ONLY_SMS:
        phoneValid = !phone ? false : true;
        break;
      case enumType.ONLY_EMAIL:
        emailValid = !email ? false : true;
        break;
      case enumType.EMAIL_SMS:
        phoneValid = !phone ? false : true;
        emailValid = !email ? false : true;
        break;
      default:
        // only-email
        emailValid = !email ? false : true;
        break;
    }

    if (!phoneValid || !emailValid) {
      return res.status(400).json({
        data: null,
        message: "Email or phone is expected.",
      });
    }

    if (email) {
      const existEmailSubscription = await getRepository(ISubscriptions).findOne({
        where: {
          email,
        },
      });

      if (existEmailSubscription) {
        return res.status(409).json({
          data: null,
          message: "This email is already registered.",
        });
      }
    }

    if (phone) {
      const existPhoneSubscription = await getRepository(ISubscriptions).findOne({
        where: {
          phone,
        },
      });

      if (existPhoneSubscription) {
        return res.status(409).json({
          data: null,
          message: "This phone is already registered.",
        });
      }
    }
    const newSubscription =  getRepository(ISubscriptions).create({
      email: email || "",
      phone: phone ||  "",
      type:type || enumType.ONLY_EMAIL
    });
    const subscription :IResponseSubscription = await getRepository(ISubscriptions).save(newSubscription) as IResponseSubscription;

    const response :IResponseSQLSubscription[]= await getRepository(IGeneric).query(`
    SELECT (V.text) AS text,(B.name) AS name,(V.chapter) AS chapter,(V.number) AS number
        FROM i_dailys AS D
            INNER JOIN i_verses AS V ON D.verse_id = V.id
                INNER JOIN i_books AS B ON V.book_id = B.id
                    WHERE D.date >= DATE(NOW())
                        ORDER BY  D.date ASC
                            LIMIT 1
    `);

    await sendWelcomeSubscription(email, response[0]);
    if(type == enumType.ONLY_SMS || type == enumType.EMAIL_SMS ){
      await sendSMS(phone, response[0].text)
    }

    return res.status(200).json({
      data: subscription,
      message: "Subscription done successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      message: "Internal error",
    });
  }
};

const subscriptionByIdAndTypeController = async (req: Request,res: Response) => {
  const { id, type } = req.params;
  try {
    const existIdSubscription = await getRepository(ISubscriptions).findOne({
      where:{
        id
      }
    });

    if (!existIdSubscription) {
      return res.status(404).json({
        data: null,
        message: "Subscription does not exists",
      });
    }
    let message = "";

    if (existIdSubscription.type == enumType.EMAIL_SMS && type != enumType.EMAIL_SMS) {
      // If is required to unsibscribe only for one type
      let phone = type ==  enumType.ONLY_SMS  ? "" : existIdSubscription.phone;
      let email = type == enumType.ONLY_EMAIL ? "" : existIdSubscription.email;
      const newType :enumType = type == enumType.ONLY_SMS ? enumType.ONLY_EMAIL : enumType.ONLY_SMS;
      message = "Subscription modified successfully";
      await getRepository(ISubscriptions).update({id: parseInt(id)},{
        type: newType, 
        phone: phone, 
        email
      });
    } else if ( existIdSubscription.type != enumType.EMAIL_SMS && type != enumType.EMAIL_SMS && type != existIdSubscription.type ) {
      message = "Subscription has not been modified";
    } else {
      message = "Subscription removed successfully";
      const subscription = await getRepository(ISubscriptions).delete({id:parseInt(id)});
    }

    return res.status(200).json({
      data: null,
      message,
    });
  } catch (error) {
   
    return res.status(500).json({
      data: null,
      message: "Internal error",
    });
  }
};
const unsubscriptionController = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const unsubscriptions :any[] = await getRepository(ISubscriptions).find({email:email});
    console.log(unsubscriptions);
    const subscription = await getRepository(ISubscriptions).delete({id:parseInt(unsubscriptions[0].id)});
    return res.status(200).json({
      data: null,
      message:"Subscription removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      message: "Internal error",
    });
  }
}
const subscriptionAllController = async (req: Request, res: Response) => {
  try {
    const subscriptions = await getRepository(ISubscriptions).find();
    return res.status(200).json({
      data: subscriptions,
      message: "Subscriptions list",
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      message: "Internal error",
    });
  }
}

export { subscriptionController, subscriptionByIdAndTypeController,subscriptionAllController,unsubscriptionController };
