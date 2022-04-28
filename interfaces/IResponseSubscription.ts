export enum enumType{
    ONLY_EMAIL='only-email',
    ONLY_SMS='only-sms',
    EMAIL_SMS='email-sms'
 }

export interface IResponseSubscription {
    email?:string;
    phone?:string;
    type?:enumType;
}

export interface IResponseSQLSubscription{
    text?:string;
    name?:string;
    chapter?:number;
    number?:number;
}
