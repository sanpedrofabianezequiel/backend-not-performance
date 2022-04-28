import { Request, Response } from "express";
import { getRepository, Not, LessThanOrEqual } from "typeorm";
import { IDailyVerseConfig } from '../entity/daily-verse-config.entity';
import { IVerses } from "../entity/Verse.entity";
import { IBooks } from '../entity/Book.entity';
import { IGeneric } from '../entity/generic.entity';
import { IResponseSQLDailyVerse } from "../interfaces/IResponseVerseTopic";
import { convertToBase64 } from "../helpers/base64";


const dailyVerseController = async (req: Request, res: Response) => {
  try {
  

    const verse  :any[]= await getRepository(IGeneric).query(`
    SELECT V.id AS id, V.book_id AS book_id,V.chapter AS chapter,V.number AS number, V.text AS text, V.url_image AS url_image,V.slug AS slug,
           B.id AS b_id, B.number AS b_number, B.name AS b_name, B.slug AS b_slug, B.testament AS b_testament, B.number_chapters AS b_number_chapters
    FROM i_dailys AS D
        INNER JOIN i_verses AS V ON D.verse_id = V.id
            INNER JOIN i_books AS B ON V.book_id = B.id
                WHERE D.date <= DATE(NOW()) AND V.url_image != ''
                    ORDER BY  D.date DESC
                        LIMIT 15
    `) as any[];
    
  
    const data :any[]=[];
    for (const x of verse) {
     /* let verseImage; TODO:Conflicto con el formato de la imagen
      if(x.url_image !== '' ){
           verseImage = await convertToBase64(x.url_image!);
      }*/
      data.push({
        id:x.id,
        book_id:x.book_id,
        chapter:x.chapter,
        number:x.number,
        text:x.text,
        url_image:x.url_image, 
        slug:x.slug,
        book: {
          id:x.b_id,
          number:x.b_number,
          name:x.b_name,
          slug:x.b_slug,
          testament:x.b_testament,
          number_chapters:x.b_number_chapters
        },
      })
    
    }

    for(let i = 0;i < data.length ; i ++) {
      let addTopics:any[]=[];
      let where :string='';
      let tops :any[]= await getRepository(IGeneric).query(`
      SELECT * FROM i_verses_have_topics WHERE verse_id = ${data[i].id}`)as any[];
      if(tops.length > 0){
          for(let x = 0;x < tops.length ;x ++ ){
              where += `   ${ tops[x].topic_id} ${ (tops[x+1] != undefined ) ? ' , ' : ' '}  `;
          }
          addTopics = await  getRepository(IGeneric).query(`
          SELECT * FROM i_topics AS T
               WHERE   T.id  IN ( ${where} ) `)as any[];
      }
      
      data[i] ={
          ...data[i],
          topics:addTopics
      }
    }
    
    return res.status(200).json({
      data: data,
      message: "Verses retrieved",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      message: "Internal error",
    });
  }
};

export { dailyVerseController };
