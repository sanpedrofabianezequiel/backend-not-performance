import { getRepository, getTreeRepository } from "typeorm";
import { IGeneric } from "../entity/generic.entity";
import { IVerses } from "../entity/Verse.entity";
import { IResponseSQLVerse, IResponseVerse } from "../interfaces/IResponseVerseTopic";
import { convertToBase64 } from "./base64";

export  const getByIdentifier =async (identifier:string)=>{
    let response :IResponseSQLVerse[];
    let result:IResponseVerse[]=[];
    const identifierSplit : string[] =  identifier.split('-');

   /* const identifierSplitReduce = identifierSplit.reduce((acum, x) => acum + x + "-", "")
    const identifierSplitReduceSliceAll =identifierSplitReduce.slice(0,identifierSplitReduce.length-5)
    const identifierSplitReduceSliceWithoutFirst =identifierSplitReduce.slice(1,identifierSplitReduce.length-5)*/
    try {
      if(identifierSplit.length == 3){
      response = await getRepository(IGeneric).query(`
      SELECT  (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
              (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at
        FROM i_verses AS V
        INNER JOIN i_books as B ON V.book_id = B.id
        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id
        WHERE B.slug = '${identifierSplit[0].toLowerCase()}' AND V.chapter = ${parseInt(identifierSplit[1])} AND V.number=${parseInt(identifierSplit[2])}
      `) as IResponseSQLVerse [];
      for (const resp of response) {
        result.push({
          id:resp.id,
          book_id:resp.book_id,
          chapter:resp.chapter,
          number:resp.number,
          slug:resp.slug,
          text:resp.text,
          url_image:resp.url_image,
          book:{
              id:resp.b_id,
              number:resp.b_number,
              name:resp.b_name,
              slug:resp.b_slug,
              testament:resp.b_testament,
              number_chapters:resp.b_number_chapters
          },
          topics: {
              id:resp.t_id,
              name:resp.t_name,
              slug:resp.t_slug,
              enabled:resp.t_enabled,
              url_image:resp.t_url_image,
          },
        });
      }
    }
      else if (!isNaN(parseInt(identifierSplit[0]))){
      response = await getRepository(IGeneric).query(`
      SELECT  (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
              (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at
        FROM i_verses AS V
        INNER JOIN i_books as B ON V.book_id = B.id
        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id
        WHERE B.slug = '${parseInt(identifierSplit[0])}-${identifierSplit[1].toLocaleLowerCase()}' AND V.chapter = ${parseInt(identifierSplit[2])} AND V.number=${parseInt(identifierSplit[3])}
      `) as IResponseSQLVerse []; 
      for (const resp of response) {
        result.push({
          id:resp.id,
          book_id:resp.book_id,
          chapter:resp.chapter,
          number:resp.number,
          slug:resp.slug,
          text:resp.text,
          url_image:resp.url_image,
          book:{
              id:resp.b_id,
              number:resp.b_number,
              name:resp.b_name,
              slug:resp.b_slug,
              testament:resp.b_testament,
              number_chapters:resp.b_number_chapters
          },
          topics: {
              id:resp.t_id,
              name:resp.t_name,
              slug:resp.t_slug,
              enabled:resp.t_enabled,
              url_image:resp.t_url_image,
          },
        });
      }
    }
    else {
      response = await getRepository(IGeneric).query(`
      SELECT  (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
              (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled,(T.created_at) t_created_at
        FROM i_verses AS V
        INNER JOIN i_books as B ON V.book_id = B.id
        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id
        WHERE B.slug = '${identifierSplit[0].toLowerCase()}' AND V.chapter = ${parseInt(identifierSplit[1])} AND V.number=${parseInt(identifierSplit[2])}
      `) as IResponseSQLVerse []; 
      for (const resp of response) {
        result.push({
          id:resp.id,
          book_id:resp.book_id,
          chapter:resp.chapter,
          number:resp.number,
          slug:resp.slug,
          text:resp.text,
          url_image:resp.url_image,
          book:{
              id:resp.b_id,
              number:resp.b_number,
              name:resp.b_name,
              slug:resp.b_slug,
              testament:resp.b_testament,
              number_chapters:resp.b_number_chapters
          },
          topics: {
              id:resp.t_id,
              name:resp.t_name,
              slug:resp.t_slug,
              enabled:resp.t_enabled,
              url_image:resp.t_url_image,
          },
        });
      }
    }
    } catch (error) {
      console.log("error",error);
    }     
  return result ;
}

export const getByChapterSlug =  async (identifier:string) =>{
    const identifierSplit = identifier.split('-');
    let data:IResponseVerse[] = [];
    let response:IResponseSQLVerse[]=[];
    const bookSlug = identifierSplit.slice(0, identifierSplit.length - 1).join('-');
    const chapter :any = identifierSplit[identifierSplit.length - 1];

    if (!isNaN(chapter)) {
      response = await getRepository(IGeneric).query(`
      SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
            (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
            (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image
        FROM i_verses AS V
        LEFT JOIN i_books AS B ON V.book_id = B.id
        LEFT JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
        LEFT JOIN i_topics AS T ON VHT.topic_id = T.id
        WHERE V.chapter = ${chapter} and B.slug = '${bookSlug}'
      `)as IResponseSQLVerse[];
    }

    for (const resp of response) {
    
      data.push({
        id:resp.id,
        book_id:resp.book_id,
        chapter:resp.chapter,
        number:resp.number,
        slug:resp.slug,
        text:resp.text,
        url_image:resp.url_image,
        book:{
            id:resp.b_id,
            number:resp.b_number,
            name:resp.b_name,
            slug:resp.b_slug,
            testament:resp.b_testament,
            number_chapters:resp.b_number_chapters
        },
        topics: {
            id:resp.t_id,
            name:resp.t_name,
            slug:resp.t_slug,
            enabled:resp.t_enabled,
            url_image:resp.t_url_image,
        },
      });
    }
    return data;
}

export const generateVerseId = (bookId:any, chapter:any, number:any) => {
    const bookIdForVerseId = bookId <= 9 ? `0${bookId}` : bookId;
    const chapterForVerseId =
      chapter <= 9 ? `00${chapter}` : chapter <= 99 ? `0${chapter}` : chapter;
    const numberForVerseId =
      number <= 9 ? `00${number}` : number <= 99 ? `0${number}` : number;
  
    return `${bookIdForVerseId}${chapterForVerseId}${numberForVerseId}`;
};
 