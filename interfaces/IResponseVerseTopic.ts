export interface IResponseVerseTopic {
    verse_id?:number;//VTH.verse_id
    verse?:{
        id?:number;
        book_id?:number;
        chapter?:number;
        number?:number,
        slug?:string;
        text?:string;
        url_image?:string;
        book?:{
            id?:number,
            number?:number,
            name?:string,
            slug?:string,
            testament?:string,
            number_chapters?:number,
        }
        topics?:{
            id?:number,
            name?:string,
            slug?:string,
            enabled?:number,
            url_image?:string,
        }
     },     
    topic_id?:number;//VTH.topic_id
    topic?:{
        id?:number,
        name?:string,
        slug?:string,
        enabled?:number,
        url_image?:string,
    }
}
export interface IResponseSQLVerseTopic{
    id?:number,
    verse_id?:number,
    topic_id?:number,
    b_id?:number,
    b_number?:number,
    b_name?:string,
    b_testament?:string,
    b_slug?:string,
    b_number_chapters?:(number | string),
    v_id?:number,
    v_book_id?:number,
    v_chapter?:number,
    v_number?:number,
    v_text?:string,
    v_url_image?:string,
    v_slug?:string,
    t_id?:number,
    t_name?:string,
    t_slug?:string,
    t_enabled?:number,
    t_url_image?:string,
}
export interface IResponseSQLVerse {
    id?:number;
    book_id?:number;
    chapter?:number;
    number?:number;
    slug?:string;
    text?:string;
    url_image?:string;
    b_id?:number,
    b_number?:number,
    b_name?:string,
    b_testament?:string,
    b_slug?:string,
    b_number_chapters?:(number | string),
    t_id?:number,
    t_name?:string,
    t_slug?:string,
    t_enabled?:number,
    t_url_image?:string,
};
export interface IResponseVerse{
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
export interface IResponseVerseSearch {
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
        name?:number;
        slug?:string;
        testament?:string;
        number_chapters?:number;
    }
    topics?: {
        id?:number;
        name?:string;
        slug?:string;
        enabled?:number;
        url_image?:string;
    },
}
export interface IResponseSQLVerseSearch{
    id?:number,
    book_id?:number;
    chapter?:number;
    number?:number;
    text?:string;
    url_image?:string;    
    slug?:string;
    vth_id?:number;
    vth_verse_id?:number;
    vth_topic_id?:number;
    t_id?:number;
    t_name?:string;
    t_slug?:string;
    t_description?:string;
    t_url_image?:string;
    t_enabled?:number;
    t_created_at?:Date|string,
    t_updated_at?:Date|string,
    t_deleted_at?:Date|number,
    b_id?:number;
    b_number?:number;
    b_testament?:string;
    b_slug?:string;
    b_number_chapters?:string|number;
    b_name?:string;
}
export interface IResponseSQLVerseIdentifier{
}
export interface IResponseSQLDailyVerse{
    id?: number,
    book_id?: number,
    chapter?: number,
    number?: number,
    text?:string,
    url_image?: string,      
    slug?: string,
    b_name?: string
}