import { Request, Response } from 'express';
import bcryptjs  from 'bcryptjs';
import { validationResult } from 'express-validator';
import { calcNumberOfPages } from '../helpers/generic';
import { IVersesHaveTopics } from '../entity/verse_topic.entity';
import { getRepository } from 'typeorm';
import { ITopics } from '../entity/Topic.entity';
import { IGeneric } from '../entity/generic.entity';
import { IResponseSQLVerse, IResponseSQLVerseTopic, IResponseVerse, IResponseVerseTopic } from '../interfaces/IResponseVerseTopic';
import { convertToBase64 } from '../helpers/base64';
import { XRay } from 'aws-sdk';

interface PropsVerseTopic {
    page?:number;
    limit?:number;
    idVerse?:number;
    topic_id?:number;
    idTopic?:number;
}

const getVersesTopicIdentifierController = async (req : Request, res :Response)=> {
    const {topicIdentifier} = req.params
    
    const schemaQuery : PropsVerseTopic = {
        page: Number(req.query.page!) -1 || 1,
        limit:Number(req.query.limit!) || 10}

    try {

        const topic = await getRepository(ITopics).findOne({
            where:[
                {id:topicIdentifier},
                {slug:topicIdentifier.toLocaleLowerCase()}
            ]
        });
        if (!topic) {
            return res.status(404).json({
              data: null,
              message: "Not found",
            });
          }

        const totalVerses = await getRepository(IVersesHaveTopics).count({
            where:{
                topic_id:topic.id
            }
        });
        const response = await getRepository(IGeneric).query(`
        SELECT  V.id id, book_id ,chapter, V.number number,V.slug slug,text,V.url_image url_image,
                B.id b_id,B.number b_number, B.name  b_name, B.testament  b_testament, B.slug b_slug,B.number_chapters b_number_chapters,
                VTH.topic_id
            FROM i_verses AS V
                INNER JOIN i_verses_have_topics AS VTH ON  VTH.verse_id = V.id
                    INNER JOIN i_books AS B ON B.id = V.book_id
                    WHERE VTH.topic_id = ${topic.id}
                         LIMIT ${schemaQuery.page},${schemaQuery.limit}               
        `)as any[]
      
        if (!response) {
            return res.status(404).json({
              data: null,
              message: "Not found",
            });
        }
        let data :any[] = [];
        let dataFinal:any[]=[];
        for (const x of response) {
           data.push({
                id:x.id!,
                book_id:x.book_id,
                chapter:x.chapter,
                number:x.number,
                slug:x.slug,
                text:x.text,
                url_image:x.url_image,
                book:{
                    id:x.b_id,
                    name:x.b_name,
                    number:x.b_number,
                    number_chapters:x.b_number_chapters,
                    slug:x.b_slug,
                    testament:x.b_testament,
                },
                topic_id:x.topic_id,
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
            message: "Retrieved",
            pagination: {
            total: totalVerses,
            pages: Math.floor(calcNumberOfPages(schemaQuery.limit!, totalVerses)),
            results: data.length,
            page: schemaQuery.page,
            limit: schemaQuery.limit 
          },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: null,
              message: "Internal error",
        });
    }
}

const postVersesTopicIdentifierController = async (req : Request, res :Response)=> {
    const {topic_id}:PropsVerseTopic = req.body
    const {idVerse} :PropsVerseTopic= req.params

    try {
        const verseTopic = await getRepository(IVersesHaveTopics).findOne({
            where: {
                topic_id, 
                verse_id:idVerse
            }
        });

        if (verseTopic) {
            return res.status(200).json({
              data: null,
              message: "Already exists",
            });
          }

        const newVerse =  getRepository(IVersesHaveTopics).create({
            topic_id,
            verse_id: idVerse,
        });
        const newVerseTopic = await getRepository(IVersesHaveTopics).save(newVerse);
        return res.status(200).json({
            data: newVerseTopic,
            message: "Data retrieved",
        })
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: "Internal error",
        })
    }
    
}


const deleteVersesTopicIdentifierController = async (req : Request, res :Response)=> {
    const {idVerse, idTopic} :PropsVerseTopic = req.params
    try {
        const verseTopic= await getRepository(IVersesHaveTopics).findOne({
            where:{
                verse_id: idVerse, 
                topic_id: idTopic
            }
        })

        if (!verseTopic) {
            return res.status(404).json({
              data: null,
              message: "Not found",
            });
          }
        
        const deleteResult = await getRepository(IVersesHaveTopics).delete({
            verse_id: idVerse,
            topic_id: idTopic,
        })
            
        return res.status(200).json({
            data: deleteResult,
            message: "Removed",
        })
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: "Internal error",
        })
    }
    
}

export {
    getVersesTopicIdentifierController,
    postVersesTopicIdentifierController,
    deleteVersesTopicIdentifierController
}
