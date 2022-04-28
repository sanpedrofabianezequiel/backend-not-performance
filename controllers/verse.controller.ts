import { Request, Response } from 'express';
import { getByChapterSlug, getByIdentifier, generateVerseId } from '../helpers/gettters';
import { calcNumberOfPages } from '../helpers/generic';
import {  getRepository, getTreeRepository } from 'typeorm';
import { IBooks } from '../entity/Book.entity';
import { IVerses } from '../entity/Verse.entity';
import { countSearch, getNextVerses, listSearch,getFormatSearch } from '../helpers/verse.helper';
import { uploadFile } from '../helpers/uploadAWS.helper';
import { IGeneric } from '../entity/generic.entity';
import { IResponseSQLVerse, IResponseVerse } from '../interfaces/IResponseVerseTopic';
import { convertToBase64 } from '../helpers/base64';

interface PropsRequest {
    page?:number;
    limit:number;
    verse_id?:number;
    url_image?:string;
    book_id?:number;
    chapter?:number;
    text?:string;
    number?:number;
  
}

interface IPropsImage {
    name?: string;
    data?: any,
    size?: number,
    encoding?: string,
    tempFilePath?: string,
    truncated?: boolean,
    mimetype?: string,
    md5?: string,
}
const getVerseWithImagesController = async (req : Request, res :Response)=> {
    try {
        const data :IResponseSQLVerse[] = await getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug
            FROM i_verses as V
                WHERE V.url_image <> ''
        `) as IResponseSQLVerse[]; 
        const verses :IResponseVerse[] = data.map(resp=>{
            return {
                id:resp.id,
                book_id:resp.book_id,
                chapter:resp.chapter,
                number:resp.number,
                slug:resp.slug,
                text:resp.text,
                url_image:resp.url_image,
            }
        })
        return res.status(200).json({
            data: verses || [],
            message: "Verses with images retrieved"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data:null,
            message:'Internal error'
        })
    }
}

const postVersesController = async (req : Request, res :Response)=> {
    const {book_id,chapter,number,text, url_image} :PropsRequest = req.body
    try {
        const slugToFind :string=  `${book_id}-${chapter}-${number}`;
        const verse = await  getByIdentifier(slugToFind);

        if(verse) {
            console.log(verse);
            return res.status(409).json({data: null,message:"Already exists the versed"});
        }

        const existsBook = await getRepository(IBooks).findOne({
            where:{
                id:book_id
            }
        }) 
        if(!existsBook){
            return res.status(409).json({data: null,message: "Conflict the book does not exist",})
        }

        const vers = await getRepository(IVerses).create({
            id : parseInt(generateVerseId(book_id,chapter,number)),
            book_id,
            chapter,
            number,
            text,
            slug:slugToFind,
            url_image:url_image|| ''
        });
        const newBook = await getRepository(IVerses).save(vers);
        return res.status(200).json({
            data: newBook,
            message:"Verses retrieved"
        })
    } catch (error) {
        return res.status(500).json({
            ok:true,
            data:null,
            message:'Internal error'
        })
    }
}

const getVersesRouterInfoController = async (req : Request, res :Response)=> {
    const schemRequest : PropsRequest = {
        page: Number(req.query.page!) - 1 || 0 ,
        limit:Number(req.query.limit!) || 10
    }
    try {

        const data :IResponseSQLVerse[] = await getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
            FROM i_verses AS V
            INNER JOIN i_books as B ON V.book_id = B.id
            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
            INNER JOIN i_topics AS T ON VHT.topic_id = T.id
            LIMIT ${schemRequest.page},${schemRequest.limit}
        `) as IResponseSQLVerse[]; 
        const verses :IResponseVerse[]=[];
        
        for (const resp of data) {
           verses.push({
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
              url_image:resp.t_url_image,
            }
           })
        }
       
        return res.status(200).json({
                data: verses || [],
                pagination: {
                  total: data.length,
                  pages: Math.floor(calcNumberOfPages(schemRequest.limit,data.length)),
                  results: data.length,
                  page:schemRequest.page,
                  limit:schemRequest.limit,
            },
            message: "Verses retrieved",
        })
    } catch (error) {
        return res.status(500).json({
            data:null,
            message:'Internal error'
        })
    }

    
}

const getVersesController = async (req : Request, res :Response)=> {
    const schemRequest : PropsRequest = {
        page: Number(req.query.page!) - 1 || 0 ,
        limit:Number(req.query.limit!) || 30
    }
    try {

        const data :IResponseSQLVerse[] = await getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
              (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
            FROM i_verses AS V
            INNER JOIN i_books as B ON V.book_id = B.id
            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
            INNER JOIN i_topics AS T ON VHT.topic_id = T.id
            LIMIT ${schemRequest.page},${schemRequest.limit}
        `) as IResponseSQLVerse[]; 

        
        let verses :IResponseVerse[]=[]; 
        for (const resp of data) {
            let verseImage;
            let bookImage;
            if(resp.url_image !== '' ){
                 verseImage = await convertToBase64(resp.url_image!);
            }
            if(resp.t_url_image !== '' ){
                bookImage = await convertToBase64(resp.t_url_image!);
           }
            verses.push({
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
                  url_image:resp.t_url_image,
                }
            });
        }
        return res.status(200).json({
                data: verses || [],
                pagination: {
                  total: data.length,
                  pages: Math.floor(calcNumberOfPages(schemRequest.limit,data.length)),
                  results: verses.length,
                  page:schemRequest.page,
                  limit:schemRequest.limit,
            },
            message: "Verses retrieved",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data:null,
            message:'Internal error'
        })
    }
}

const getVersesIdentifierController = async (req : Request, res :Response)=> {
    const {identifier}= req.params;
    try {     
        let verse :any[] =  await getByIdentifier(identifier); 
        if(!verse) return res.status(404).json({ data:null,message:'Not found'});
        let addTopics:any[]=[];
        let where :string='';
        let tops :any[]= await getRepository(IGeneric).query(`
        SELECT * FROM i_verses_have_topics WHERE verse_id = ${verse[0].id}`)as any[];
        if(tops.length > 0){
            for(let x = 0;x < tops.length ;x ++ ){
                where += `   ${ tops[x].topic_id} ${ (tops[x+1] != undefined ) ? ' , ' : ' '}  `;
            }
            addTopics = await  getRepository(IGeneric).query(`
            SELECT * FROM i_topics AS T
                 WHERE   T.id  IN ( ${where} ) `)as any[];          
        }
        verse[0] ={
            ...verse[0],
            topics:addTopics
        }     
       
        return res.status(200).json({
            data:verse[0],
            message: "Verse retrieved"
        })
    } catch (error) {
        return res.status(500).json({
            ok:true,
            data:null,
            message:'Internal error'
        })
    }
}

const getBooksChaptersController = async (req : Request, res :Response)=> {
    const {identifier}= req.params
    try {
        const verses = await getByChapterSlug(identifier);
        let data :any = verses;
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

        let hash :any = {};
        let arraySet = data.filter((x:any)=> hash[x.id] ? false : (hash[x.id]=true));
        return res.status(200).json({
            data: arraySet ,
            message: "Verse retrieved",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data:null,
            message:'Internal error'
        });
    }
}

const deleteVerseByIdController = async (req : Request, res :Response)=> {
    const {id}= req.params
    try {
        const existsVerse = await getTreeRepository(IVerses).findOne({
            where:{
                id
            }
        });

        if(!existsVerse){
            return res.status(404).json({
                data: null,
                message: "Not found",
              });
        }
        const verse = await getRepository(IVerses).delete({id: parseInt(id)});

        return res.status(401).json({
            data:verse,
            message: "Verse deleted",
    })
    } catch (error) {
        return res.status(500).json({
            ok:true,
            data:null,
            message:'Internal error'
        });
    }   
    
}

const putVerseByIdController = async (req : Request, res :Response)=> {
    const {id}= req.params
    const {book_id, chapter, number, text}=req.body
    let resp : IResponseSQLVerse[]=[];
    let data : IResponseVerse[]=[];
    try {
        const existsVerse = await getRepository(IVerses).findOne({
            where:{
                id : parseInt(id)
            }
        });

        if(!existsVerse){
            return res.status(404).json({
                data: null,
            message: "Not found",
          });
        }
        const existsBook = await getRepository(IVerses).findOne({
            where:{
                id : parseInt(id)
            }
        });
        if(!existsBook){
            return res.status(409).json({
                data: null,
                message: "Conflict the book does not exist",
          });
        }
        const idtoBeUpdated =  generateVerseId(book_id,chapter,number);

        if (id != idtoBeUpdated) {
            const existsVerseToUpdate = await getRepository(IVerses).findOne({
                where:{
                    id:parseInt(idtoBeUpdated)
                }
            })
            if (existsVerseToUpdate) return res.status(409).json({data: null,message:"Conflict already exists a verse with the same bookId, chapter and number",});
        }

        await getRepository(IVerses).update({id:parseInt(id)},{
            id:parseInt(generateVerseId(book_id,chapter,number)),
            book_id,
            chapter,
            number
        });
  
        resp  = await getRepository(IGeneric).query(`
        SELECT  V.id id, book_id ,chapter, V.number number,V.slug slug,text,V.url_image url_image,
            B.id b_id,B.number b_number, B.name  b_name, B.testament  b_testament, B.slug b_slug,B.number_chapters b_number_chapters,
            T.id t_id,T.name t_name, T.slug  t_slug, T.enabled  t_enabled, T.url_image t_url_image
        FROM i_verses AS V
            INNER JOIN i_books AS B ON V.book_id = B.id
                INNER JOIN i_verses_have_topics AS VTH ON V.id = VTH.verse_id
                    INNER JOIN i_topics AS T ON VTH.topic_id = T.id
                            WHERE V.id = ${idtoBeUpdated}
                                LIMIT 1
        `) as IResponseSQLVerse[];
        let verseImage;
        let bookImage;
        for (const response of resp) {
          
            if(response.url_image !== '' ){
                 verseImage = await convertToBase64(response.url_image!);
            }
            if(response.t_url_image !== '' ){
                bookImage = await convertToBase64(response.t_url_image!);
           }

            data.push({
                id:response.id,
                book_id:response.book_id,
                chapter:response.chapter,
                number:response.number,
                slug:response.slug,
                text:response.text,
                url_image:response.url_image,
                book:{
                    id:response.b_id,
                    name:response.b_name,
                    number:response.b_number,
                    number_chapters:response.b_number_chapters,
                    slug:response.b_slug,
                    testament:response.b_testament,
                },
                topics:{
                    id:response.t_id,
                    enabled:response.t_enabled,
                    name:response.t_name,
                    slug:response.t_slug,
                    url_image:response.t_url_image
                }
            });
        }

        return res.status(401).json({
            data,
            message: "Verse updated",
        });
    } catch (error) {
        return res.status(500).json({
            ok:true,
            data:null,
            message:'Internal error'
        });
    }
}

const getVerseRandomController = async (req : Request, res :Response)=> {
   
    let data : IResponseVerse[]=[];
    try {
         let response = await  getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
            FROM i_verses AS V
            INNER JOIN i_books as B ON V.book_id = B.id
            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
            INNER JOIN i_topics AS T ON VHT.topic_id = T.id
            ORDER BY RAND()
            LIMIT 1
        `) as IResponseSQLVerse[];
               
        if(!response){
            return res.status(404).json({
                data:null,
                message: "Not found",
            })
        }

        let verseImage;
        let bookImage;
        for (const resp of response) {
          
            if(resp.url_image !== '' ){
                 verseImage = await convertToBase64(resp.url_image!);
            }
            if(resp.t_url_image !== '' ){
                bookImage = await convertToBase64(resp.t_url_image!);
           }

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
                  url_image:resp.t_url_image,
                }
            });
        }
        
        let responseRelated =  await getRepository(IGeneric).query(`
        SELECT (V.id) id,(V.book_id) book_id,(V.chapter) chapter,(V.number) number,(V.text) text,(V.url_image) url_image,(V.slug) slug,
               (B.id) b_id,(B.number) b_number,(B.name) b_name,(B.testament) b_testament,(B.slug) b_slug,(B.number_chapters) b_number_chapters,
               (T.id) t_id,(T.name) t_name,(T.slug) t_slug,(T.description) t_description,(T.url_image) t_url_image,(T.enabled) t_enabled
            FROM i_verses AS V
            INNER JOIN i_books as B ON V.book_id = B.id
            INNER JOIN i_verses_have_topics AS VHT ON V.id = VHT.verse_id
            INNER JOIN i_topics AS T ON VHT.topic_id = T.id
            WHERE V.chapter = ${data[0].chapter} and V.book_id =  ${data[0].book_id} and V.number != ${data[0].number}
        `) as IResponseSQLVerse[];
        let dataRelated: IResponseVerse[]=[];
        for (const respQuery of responseRelated) {
           dataRelated.push({
                id:respQuery.id,
                book_id:respQuery.book_id,
                chapter:respQuery.chapter,
                number:respQuery.number,
                slug:respQuery.slug,
                text:respQuery.text,
                url_image:respQuery.url_image,
                book:{
                  id:respQuery.b_id,
                  name:respQuery.b_name,
                  number:respQuery.b_number,
                  number_chapters:respQuery.b_number_chapters,
                  slug:respQuery.b_slug,
                  testament:respQuery.b_testament
                },
                topics:{
                  id:respQuery.t_id,
                  enabled:respQuery.t_enabled,
                  name:respQuery.t_name,
                  slug:respQuery.t_slug,
                  url_image:respQuery.t_url_image,
                }
            });
        }
    
        return res.status(200).json({
            data: {
                data,
                dataRelated
            },
            message: "Verse retrieved",
        })

    } catch (error) {
        res.status(500).json({
            data: null,
            message: "Internal error",
        });
    }
}

const postVerseSearchController = async (req : Request, res :Response)=> {
    const {text} = req.body;
    const schemRequest : PropsRequest = {
        page: Number(req.query.page!) - 1 || 0 ,
        limit:Number(req.query.limit!) || 10
    }
    try {
        const totalVerses =  await countSearch(text.toLowerCase());
        const verses :any[] = await listSearch(text.toLowerCase(),schemRequest.page, schemRequest.limit);
        if(verses.length === 0){
            return res.status(404).json({
                data:[],
                message: "Not found any verse",
            })  
        }
         
        for(let i = 0;i < verses.length ; i ++) {
            let addTopics:any[]=[];
            let where :string='';
            let tops :any[]= await getRepository(IGeneric).query(`
            SELECT * FROM i_verses_have_topics WHERE verse_id = ${verses[i].id}`)as any[];
            if(tops.length > 0){
                for(let x = 0;x < tops.length ;x ++ ){
                    where += `   ${ tops[x].topic_id} ${ (tops[x+1] != undefined ) ? ' , ' : ' '}  `;
                }
                addTopics = await  getRepository(IGeneric).query(`
                SELECT * FROM i_topics AS T
                     WHERE   T.id  IN ( ${where} ) `)as any[];
            }
            
            verses[i] ={
                ...verses[i],
                topics:addTopics
            }
        }
        let hash :any = {};
        let arraySet = verses.filter((x:any)=> hash[x.id] ? false : (hash[x.id]=true));
        return res.status(200).json({
            data: {
                data: arraySet || [],
                pagination: {
                  total: parseInt(totalVerses[0].total),
                  pages: Math.floor(calcNumberOfPages(schemRequest.limit, totalVerses[0].total)),
                  results: verses.length,
                  page: (schemRequest.page) ? schemRequest.page! + 1 : 1,
                  limit:schemRequest.limit,
                },
            },
            message: "Verse retrieved",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            data: null,
            message: "Internal error check your query",
        });
    }
}

const nextVerseController = async (req : Request, res :Response)=> {
    const schemRequest : PropsRequest = {
        verse_id: Number(req.query.verse_id!),
        limit:Number(req.query.limit!) || 10
    }
    try {
       
        const verses = await getNextVerses(schemRequest.verse_id!, schemRequest.limit);
        return res.status(200).json({
            data:{
                data: verses || [],
            },
            message: "Verse retrieved",
        })
    } catch (error) {
        res.status(500).json({
            data: null,
            message: "Internal error",
        });
    }
}

const verseIdentifierImagesController = async (req : Request, res :Response)=> {
    const {identifier}=req.params;
    try {
        const existsVerse:IResponseVerse[] =  await getByIdentifier(identifier); 
        
        if (!existsVerse)  return res.status(404).json({data: null, message: "Not found"});

        const newFile:any = req.file! as IPropsImage;

        const allowedFileType = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowedFileType.includes(newFile.mimetype!)) {
            return res.status(400).json({
              data: null,
              message: "Bad request",
            });
        }

        const urlFileProvider = await uploadFile(
            newFile,
            `verses/${newFile.originalname}`,
            newFile.mimetype!,
            false
        );
  
        if (urlFileProvider == '') {
            return res.status(500).json({
              data: {},
              message: "Error uploading file to the provider",
            });
        }

        const ids = generateVerseId(existsVerse[0].book_id,existsVerse[0].chapter,existsVerse[0].number);
        await getRepository(IVerses).update({id:existsVerse[0].id},{
            id:parseInt(ids),
            book_id: existsVerse[0].book_id,
            chapter: existsVerse[0].chapter,
            number: existsVerse[0].number,
            text: existsVerse[0].text,
            slug: existsVerse[0].slug,
            url_image:urlFileProvider
        });

        return res.status(200).json({
            data: {
            ...existsVerse[0],
            url_image: urlFileProvider
          },
          message: "Image added to the verse",
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            data: null,
            message: "Internal error",
        });
    }
}



export {
    postVersesController,
    getVersesRouterInfoController,
    getVersesController,
    getVersesIdentifierController,
    getBooksChaptersController,
    deleteVerseByIdController,
    putVerseByIdController,
    getVerseRandomController,
    postVerseSearchController,
    nextVerseController,
    verseIdentifierImagesController,
    getVerseWithImagesController
}
