import { IBooks } from "../entity/Book.entity";
import { ITopics } from "../entity/Topic.entity";

export interface IResponseSQLBook {
    id?: number,
    book_id?:number,
    chapter?:number;
    number?:number;
    slug?:string;
    text?:string;
    url_image?:string;
    bid?:number;
    bnumber?:number;
    bname?:string;
    bslug?:string;
    btestament?:string;
    number_chapters?:string;
    tid?:number;
    tname?:string;
    tslug?:string;
    tenabled?:number;
    turl_image?:string;
}
export interface IResponseBook{
    id?:number;
    book_id?:number;
    chapter?:number;
    number?:number;
    slug?:string;
    text?:string;
    url_image?:string;
    book?:{
        id?:number;
        number?:number;
        name?:(string | number);
        slug?:string;
        testament?:string;
        number_chapters?:(number | string);
    }
    topics?: {
        id?:number;
        name?:string;
        slug?:string;
        enabled?:number;
        url_image?:string;
    },
}