import { Request, Response } from 'express';
import bcryptjs  from 'bcryptjs';
import { validationResult } from 'express-validator';
import { getRepository, getTreeRepository, Like } from 'typeorm';
import { ITopics } from '../entity/Topic.entity';
import { calcNumberOfPages, generateSlug } from '../helpers/generic';
import { uploadFile } from '../helpers/uploadAWS.helper';
import { convertToBase64 } from '../helpers/base64';


interface PropsRequest {
    page?:number;
    limit?:number;
    book_id?:number;
    chapter?:number;
    name?:string;
    description?:string;
    enabled?:number
}
/*interface PropsFiles {
    fielname?: string,
    name?: string ,
    encoding?: string,
    mimetype?: string,
    destination?: string,
    filename?: string,
    path?: string,
    size?: number
} */

const postTopicController = async (req : Request, res :Response)=> {
    const {name,description,enabled} : PropsRequest = req.body
    try {
        const topicByName = await getRepository(ITopics).findOne({
            where:{
                name
            }
        })
        if(topicByName){
            return res.status(409).json({
                data:null,
                messagE:"Already exists a topic with the same name"
            });
        }
        const topic =  getRepository(ITopics).create({
            url_image:'',
            name,
            slug: generateSlug(name),
            description,
            enabled: enabled
            
        })
        const newTopic = await getRepository(ITopics).save(topic);
        return res.status(200).json({data:{...newTopic},message:"Topic retrieved"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const getTopicController = async (req : Request, res :Response)=> {
    const schemaQuery : PropsRequest = {
        page: Number(req.query.page!) - 1 || 0 ,
        limit:Number(req.query.limit!) || 10
    }
    
    try {

        const [topics,totalTopics]  = await getRepository(ITopics).findAndCount({
            skip:schemaQuery.page,
            take:schemaQuery.limit
        });
        const data = topics.map((x)=> {
            return {
                id: x.id,
                name: x.name,
                slug: x.slug,
                enabled: x.enabled,
                url_image: x.url_image,
            }
        })
        return res.status(200).json({
                data: data || [],
                pagination: {
                  total: totalTopics,
                  pages: Math.floor(calcNumberOfPages(schemaQuery.limit!, totalTopics)),
                  results: topics.length,
                  page:schemaQuery.page,
                  limit:schemaQuery.limit,
              },
              message: "Topics retrieved",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const getTopicIdentifierController = async (req : Request, res :Response)=> {
    const {identifier} = req.params
    try {
        const topic = await getRepository(ITopics).findOne({
            where:[
                {id:identifier},
                {slug:identifier}
            ]
        });
      
        return res.status(200).json({
            data: {
                id: topic?.id,
                name: topic?.name,
                slug: topic?.slug,
                enabled: topic?.enabled,
                url_image: topic?.url_image,
            },
            message: "Topic retrieved",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const deleteTopicByIdController = async (req : Request, res :Response)=> {
    const {id} = req.params
    try {
        const existsTopic = await getRepository(ITopics).findOne({
            where:{
                id
            }
        });
        if (!existsTopic) {    
            return res.status(404).json({
              data: null,
              message: "Not found",
            });
        }

        const topic = await getRepository(ITopics).delete({id:parseInt(id)});
        return res.status(200).json({
            data: topic,
            message: "Topic deleted",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const putTopicByIdController = async (req : Request, res :Response)=> {
    const {id} = req.params
    const {name, enabled} = req.body
    try {
        const existsTopic = await getRepository(ITopics).findOne({
            where:{
                id
            }
        });

        if(!existsTopic){
            return res.status(404).json({
                data:null,
                message:'Not found'
            });
        }
        if (name != existsTopic.name) {
            const topicByName = await getRepository(ITopics).findOne({
                where:{
                    name
                }
            });  
            if (topicByName) {
              return res.status(409).json({
                data: null,
                message: "Already exists a topic with the same name",
              });
            }
        }
        await getRepository(ITopics).update({id:parseInt(id)},{
            ...req.body,
            slug: generateSlug(name),
            id:existsTopic.id
        });

        const updatedTopic = await getRepository(ITopics).findOne({
            where:{
                id
            }
        })

        return res.status(200).json({
            data: updatedTopic,
            message: "Topic updated",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const putTopicByIdAndImageController = async (req : Request, res :Response)=> {
    const {id} = req.params;
    try {
        const existsTopic = await getRepository(ITopics).findOne({
            where:{
                id
            }
        });
        console.log(existsTopic)
        if(!existsTopic){
            return res.status(404).json({
                data:null,
                message:'Not found'
            });
        }
        
        if(!req.file){
            return res.status(400).json({
                data:null,
                message:"bad request"
            })
        };

        const newFile:any = req.file!;
        const allowedFileType = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowedFileType.includes(newFile.mimetype!)) {
            return res.status(400).json({
              data: null,
              message: "Bad request",
            });
        }
        console.log(newFile)
        const urlFileProvider = await uploadFile(
            newFile,
            `topics/${newFile.originalname}`,
            newFile.mimetype!,
            false
        );

        if (urlFileProvider == '') {
            return res.status(500).json({
              data: {},
              message: "Error uploading file to the provider",
            });
        }
        let updatedTopic = existsTopic;
        
        await getRepository(ITopics).update({id:parseInt(req.params.id)},{
            ...existsTopic,
            url_image:urlFileProvider
        });
      
        return res.status(200).json({
            data: {
                ...updatedTopic,
                url_image: urlFileProvider,
            },
            message: "Image added to the topic",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null,message:'Internal error'});
    }
}

const topicBySearchController = async (req : Request, res :Response)=> {
    const {text} = req.body
    const schemaQuery : PropsRequest = {
        page: Number(req.query.page!) - 1 || 0 ,
        limit:Number(req.query.limit!) || 10
    }
    try {
        const totalTopics = await getRepository(ITopics).count({
            where:[
                { name: Like(`%${text}%`)}
            ]
        });
      
        const topics = await getRepository(ITopics).find({
            name: Like(`%${text}%`)
        });
        
        return res.status(200).json({
                data: topics || [],
                pagination: {
                  total: totalTopics,
                  pages: Math.floor(calcNumberOfPages(schemaQuery.limit!, totalTopics)),
                  results: topics.length,
                  page:schemaQuery.page,
                  limit:schemaQuery.limit,
              },
              message: "Topics retrieved",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data:null,
            message:'Internal error'
        });
    }
}


export {
    postTopicController,
    getTopicController,
    getTopicIdentifierController,
    deleteTopicByIdController,
    putTopicByIdController,
    putTopicByIdAndImageController,
    topicBySearchController
}
