import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { IBooks, ETestament } from '../entity/Book.entity';

import bcryptjs  from 'bcryptjs';
import { calcNumberOfPages } from '../helpers/generic';
import { IVerses } from '../entity/Verse.entity';
import { IGeneric } from '../entity/generic.entity';
import { IResponseBook, IResponseSQLBook } from '../interfaces/IResponseBook';
import { convertToBase64 } from '../helpers/base64';


interface PropsRequest {
    page:number;
    limit:number;
    book_id?:number;
    chapter?:number;
    testament?:ETestament
    number?:number;
    name?:string;
}


const bookController = async (req : Request, res :Response)=> {
    const {number,name,testament}:PropsRequest = req.body;
    try {
        if( !(testament == ETestament.OT ||  testament == ETestament.NT)) return res.status(404).json({data:null,message:'Testament invalid. You should use OT or NT'})
        const bookByNumberAndName = await getRepository(IBooks).findOne({
            where:[
                {name},
                {number}
            ]
        })
        if(bookByNumberAndName) return res.status(409).json({data:null,message:'Already exists a book with the same number or name'})
        const newBook = getRepository(IBooks).create({
            slug:name?.toLowerCase().trim().replace(/ /g, '-'),
            name,
            number,
            testament
        });
        const book = await getRepository(IBooks).save(newBook);
        return res.status(200).json({data:book||[],message:'Book retrieved'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const booksController = async (req : Request, res :Response)=> {
    
    const schemaQuery : PropsRequest = {
        page: Number(req.query.page!) - 1 || 0 ,
        limit:Number(req.query.limit!) || 10
    }

    try {
        const [books,totalBooks]  = await getRepository(IBooks).findAndCount({
            skip:schemaQuery.page,
            take:schemaQuery.limit
        });
        
        return res.status(200).json({
            data:books || [],
            pagination:{
                total:totalBooks,
                pages:Math.floor(calcNumberOfPages(schemaQuery.limit,totalBooks)),
                results:books.length,
                page:schemaQuery.page,
                limit: schemaQuery.limit == -1 ? books.length: schemaQuery.limit
            },
            message:'Book retrieved',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const booksIdentifierController = async (req : Request, res :Response)=> {
    const {identifier} = req.params;
   try {
        let book;
        if(isNaN(Number(identifier))){
            book = await getRepository(IBooks).findOne({
                where:{
                    slug:identifier
                }
            })
        }else{
            book = await getRepository(IBooks).findOne({
                where:[
                    {id:identifier},
                    {slug:identifier}
                ]
            });
        }
        return res.status(200).json({
            data:book,
        })
    } catch (error) {
        return res.status(500).json({
            data:null,
            msg:'Internal error'
        })
    }
}

const booksChapterController = async (req : Request, res :Response)=> {
    const schemaQuery : PropsRequest = {
        page: Number(req.query.page!) - 1 || 0 ,
        limit:Number(req.query.limit!) || 10
    }
   try {
        const response :IResponseSQLBook []= await getRepository(IGeneric).query(`
        SELECT (V.id) AS id,(V.book_id)  AS book_id,(V.chapter) AS chapter,(V.number) AS number, (V.slug)       AS slug, (V.text) AS text,(V.url_image) AS url_image,
               (B.id) AS bid, (B.number) AS bnumber,(B.name)    AS bname,(B.slug)     AS bslug,(B.testament)    AS btestament, (B.number_chapters) AS number_chapters,
               (T.id) AS tid, (T.name)   AS tname,(T.slug)      AS tslug,(T.enabled)  AS tenabled,(T.url_image) AS turl_image
        FROM i_verses AS V
        INNER JOIN i_books AS B ON V.book_id = B.id
        INNER JOIN i_verses_have_topics as VHT ON V.id = VHT.verse_id
        INNER JOIN i_topics T ON VHT.topic_id = T.id
        WHERE V.book_id = ${req.params.book_id} AND V.chapter = ${req.params.chapter}
        LIMIT ${schemaQuery.page}, ${schemaQuery.limit}
        `);
 
        let data :any[] = [];
        for(const x of response){
           data.push({
                id:x.id,
                book_id:x.book_id     || -1,
                number:x.number       || -1,
                slug:x.slug           || '',
                text:x.text           || '',
                url_image:x.url_image || '',
                book:{
                    id:x.bid ,
                    number:x.bnumber,
                    name:x.bname      || '',
                    slug:x.bslug      || '',
                    testament:x.btestament || '',
                    number_chapters: x.number_chapters,
                },
                topics:{
                    id:x.tid ,
                    name:x.tname ,
                    slug:x.tslug ,
                    enabled:x.tenabled ,
                    url_image:x.turl_image,
                }
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
            data:data,
            message:"Verses retrieved",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data:null,
            msg:'Internal error'
        })
    }
}

const deleteBookByIdController = async (req : Request, res :Response)=> {
    const {id} = req.params;
    try {
        const existBook = await getRepository(IBooks).findOne({
            where:{
                id
            }
        });
        if(!existBook)  return res.status(404).json({data:null,message:'Not found'})

        const book = await getRepository(IBooks).delete({id: parseInt(id)});
        return res.status(200).json({
            data:book,
            message:'Book deleted'
        }); 
    } catch (error) {
        return res.status(500).json({
            data:null,
            msg:'Internal error'
        })
    }
}

const putBookByIdController = async (req : Request, res :Response)=> {
    const {number, name, testament} = req.body;
    const {id} = req.params;
    let slug;
    try {
        const existBook = await getRepository(IBooks).findOne({
            where:{
                id
            }
        });
        if(!existBook) return res.status(404).json({data:null,message:'Not found'})
        
        if(number != existBook.number){
            const bookByNumber = await getRepository(IBooks).findOne({
                where:{
                    number
                }
            });

            if(bookByNumber){
                return res.status(409).json({data:null,message:'Already exists a book with the same number'})
            }
        }
        
        if(name != existBook.name){
            const bookByName =  await getRepository(IBooks).findOne({
                where:{
                    name
                }
            });
            if(bookByName){
                return res.status(409).json({data:null,message:'Already exists a book with the same name'})
            }
        }
        
        if(name){
            slug=name.toLowerCase().trim();
        }
      
        existBook.id=parseInt(id);
        existBook.name = name;
        existBook.number=number;
        existBook.testament=testament;
        existBook.slug=slug;
        await getRepository(IBooks).update({id:parseInt(id)},existBook);
        const bookUpdate = await getRepository(IBooks).findOne({
            where:{
                id
            }
        });
        return res.status(200).json({
            data:bookUpdate,
            message:'Book updated'
        })
    } catch (error) {
        return res.status(500).json({
            ok:false,
            data:null,
            msg:'Internal error'
        })
    }
}

export {
    bookController,
    booksController,
    booksIdentifierController,
    booksChapterController,
    deleteBookByIdController,
    putBookByIdController
}
