import { getRepository, Like, MoreThan } from "typeorm";
import { IBooks } from "../entity/Book.entity";
import { IVerses } from '../entity/Verse.entity';
import { IGeneric } from '../entity/generic.entity';
import { IResponseSQLVerse, IResponseSQLVerseSearch, IResponseVerse, IResponseVerseSearch } from "../interfaces/IResponseVerseTopic";
import { convertToBase64 } from "./base64";

interface PropsInfo {
    isValid: boolean;
    bookName: string;
    chapter: string | number;
    verses: any[];
    type: string;
}

let books = [];
let booksSlugs: any[] = [];
interface IFormatText {
    valid:boolean,
    firstComponent:{ bookName: string, chapter:number,items:number };
    secondComponent:{ numvers:number[] };
    [key:string]: any;
}
export const getFormatSearch=(text:string = ''):string => {
    let where:string='';
    let result :IFormatText={
        valid:false,
        firstComponent:{
            bookName:'',
            chapter:0,
            items:0
        },
        secondComponent:{
            numvers:[]
        }
    };
    try {
        const textSplit =  text.split(' ');
        const textSplitAll = textSplit.slice(0,textSplit.length-1);
        const textSplitAllReduce =textSplitAll.reduce((acum, x) => acum + x + " ", "")
        const textSplitAllReduceSlice= textSplitAllReduce.slice(0,textSplitAllReduce.length-1)
        const textChapterAndNumber = textSplit.slice(textSplit.length-1, textSplit.length);

        if(!text.includes(':')){
            result.firstComponent.chapter =  Number(textChapterAndNumber);
            result.firstComponent.bookName = textSplitAllReduceSlice;

            if(result.firstComponent.chapter){
                where += ` B.name LIKE '%${result.firstComponent.bookName}%' AND V.chapter = ${result.firstComponent.chapter}`;
            }else if(textSplit.length === 1){
                console.log('emtre')
                where += `  (B.name like '%${text}%' OR V.text LIKE '%${text}%') `;
            }else{
                where += ` V.text LIKE '%${text}%'`;
            }
        }else{
            const formatText = text.split(':');
            result.firstComponent.bookName = textSplitAllReduceSlice;
            result.firstComponent.chapter =  parseInt(textChapterAndNumber[0]);
            result.secondComponent.numvers = formatText[1].split('-').map(v=>parseInt(v));
            if(result.secondComponent.numvers.length === 2 ){
                where += ` B.name LIKE '%${result.firstComponent.bookName}%' AND V.chapter = ${result.firstComponent.chapter} AND V.number BETWEEN ${result.secondComponent.numvers[0]} AND ${result.secondComponent.numvers[1]}`;
            }else if(result.secondComponent.numvers.length === 1){
                where += ` B.name LIKE '%${result.firstComponent.bookName}%' AND V.chapter = ${result.firstComponent.chapter} AND V.number = ${result.secondComponent.numvers[0]}`;
            }
        }
        return where;
    } catch (error) {
        return '';
    }
}

export const countSearch = async (text: string = '') => {
    let query = ` SELECT COUNT(*) AS total FROM i_verses AS V  LEFT JOIN i_books AS B ON V.book_id = B.id  `;
    query += `  WHERE  ${getFormatSearch(text)} `;
    const count = await getRepository(IGeneric).query(query);
    return count;
}

export const listSearch = async (text: string = '', page: number = 1, limit: number = 10) => {
    let query = ` SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
                    (VTH.id) AS vth_id,(VTH.verse_id) vth_verse_id,(VTH.topic_id) vth_topic_id,
                    (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at,(T.updated_at) t_updated_at,(T.deleted_at) t_deleted_at,
                    (B.id) b_id,(B.number) b_number,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,(B.name) b_name
                FROM i_verses AS V
    `;
    query += `INNER JOIN i_books as B ON V.book_id = B.id
            LEFT JOIN i_verses_have_topics AS VTH ON V.id = VTH.verse_id
            LEFT JOIN i_topics AS T ON VTH.topic_id = T.id`;
    query += `  WHERE  ${getFormatSearch(text)} LIMIT ${page*limit},${limit} `;
    const response: IResponseSQLVerseSearch[] = await getRepository(IGeneric).query(query) as IResponseSQLVerseSearch[];

    const listSearch: IResponseVerseSearch[] = response.map((x: IResponseSQLVerseSearch) => {
        return {
            id: x.id,
            book_id: x.book_id,
            chapter: x.chapter,
            number: x.number,
            slug: x.slug,
            text: x.text,
            url_image: x.url_image,
            book: {
                id: x.b_id,
                name: x.b_name,
                number: x.b_number,
                number_chapters: x.b_number_chapters,
                slug: x.b_slug,
                testament: x.b_testament,
            },
            topics: {
                id: x.t_id,
                enabled: x.t_enabled,
                name: x.t_name,
                slug: x.t_slug,
                url_image: x.t_url_image
            }
        } as IResponseVerseSearch;
    });

    return listSearch;
}
const countNextVerses = async (verseId: number) => {
    const where = {
        id: MoreThan(verseId),
    };
    const count = await getRepository(IVerses).count({
        where,
    });
    return count;
};

export const getNextVerses = async (verseId: number, limit: number) => {
    const count = await countNextVerses(verseId);
    let data: IResponseSQLVerse[];
    let result: IResponseVerse[] = [];
    if (count > limit) {
        data = await getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
                (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
                (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
            FROM i_verses AS V
            INNER join i_books as B ON V.book_id = B.id
            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
            INNER JOIN i_topics AS T ON VHT.topic_id = T.id
            WHERE V.id > ${verseId}
            LIMIT ${limit}
        `) as IResponseSQLVerse[];

        for (const resp of data) {
         
            result.push({
                id: resp.id,
                book_id: resp.book_id,
                chapter: resp.chapter,
                number: resp.number,
                slug: resp.slug,
                text: resp.text,
                url_image: resp.url_image,
                book: {
                    id: resp.b_id,
                    name: resp.b_name,
                    number: resp.b_number,
                    number_chapters: resp.b_number_chapters,
                    slug: resp.b_slug,
                    testament: resp.b_testament
                },
                topics: {
                    id: resp.t_id,
                    enabled: resp.t_enabled,
                    name: resp.t_name,
                    slug: resp.t_slug,
                    url_image: resp.t_url_image,
                }
            });
        }
    } else {
        const diff = limit - count;
        const versesBefore: IResponseSQLVerse[] = await getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
          FROM i_verses AS V
          INNER join i_books as B ON V.book_id = B.id
          INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
          INNER JOIN i_topics AS T ON VHT.topic_id = T.id
          WHERE V.id > ${verseId}
          LIMIT ${limit}
        `) as IResponseSQLVerse[];
        let versesB: IResponseVerse[] = [];
        for (const resp of versesBefore) {
          
            versesB.push({
                id: resp.id,
                book_id: resp.book_id,
                chapter: resp.chapter,
                number: resp.number,
                slug: resp.slug,
                text: resp.text,
                url_image: resp.url_image,
                book: {
                    id: resp.b_id,
                    name: resp.b_name,
                    number: resp.b_number,
                    number_chapters: resp.b_number_chapters,
                    slug: resp.b_slug,
                    testament: resp.b_testament
                },
                topics: {
                    id: resp.t_id,
                    enabled: resp.t_enabled,
                    name: resp.t_name,
                    slug: resp.t_slug,
                    url_image: resp.t_url_image,
                }
            });

            const versesAfter: IResponseSQLVerse[] = await getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
          FROM i_verses AS V
          INNER JOIN i_books as B ON V.book_id = B.id
          INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
          INNER JOIN i_topics AS T ON VHT.topic_id = T.id
          LIMIT ${diff}
        `) as IResponseSQLVerse[];

            let versesAf: IResponseVerse[] = [];
            for (const resp of versesAfter) {
               
                versesAf.push({
                    id: resp.id,
                    book_id: resp.book_id,
                    chapter: resp.chapter,
                    number: resp.number,
                    slug: resp.slug,
                    text: resp.text,
                    url_image: resp.url_image,
                    book: {
                        id: resp.b_id,
                        name: resp.b_name,
                        number: resp.b_number,
                        number_chapters: resp.b_number_chapters,
                        slug: resp.b_slug,
                        testament: resp.b_testament
                    },
                    topics: {
                        id: resp.t_id,
                        enabled: resp.t_enabled,
                        name: resp.t_name,
                        slug: resp.t_slug,
                        url_image: resp.t_url_image,
                    }
                });
            }
            result = [...versesB, ...versesAf];
        }
    }
    return result;
}

export const groupVersesByBookChapter = (verses: IResponseVerse[]) => {

    const versesGroupedByChapterBook = [];

    versesGroupedByChapterBook.push({
        bookName: verses[0].book?.name,
        chapter: verses[0].chapter,
        verses: []
    });

    let currentGroupId = 0;

    for (let i = 0; i < verses.length; i++) {

        const v = verses[i];

        if (v.chapter != versesGroupedByChapterBook[currentGroupId].chapter) { // Change the chapter or book

            versesGroupedByChapterBook.push({
                bookName: v.book?.name,
                chapter: v.chapter,
                verses: [{
                    number: v.number,
                    text: v.text
                }]
            });
            currentGroupId++;
        } else {
            versesGroupedByChapterBook[currentGroupId].verses.push({
                number: v.number,
                text: v.text
            });
        }
    }
    return versesGroupedByChapterBook;
}