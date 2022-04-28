import { Request, Response } from 'express';
import bcryptjs  from 'bcryptjs';
import { validationResult } from 'express-validator';
import { Any, getRepository } from 'typeorm';
import { ITestimonies } from '../entity/Testimony.entity';
import { calcNumberOfPages } from '../helpers/generic';

interface PropsTestimonies {
    page?:number;
    limit?:number;
    title?:string;
    content?:string;
    tag?:string;
}
const postTestimoniesController = async (req : Request, res :Response)=> {
    const {title , content,tag}:PropsTestimonies= req.body
   
    try {

        const newTestimony=  getRepository(ITestimonies).create({
            ...req.body,
            created_by: "system"
        }); 
        
        const testimony = await getRepository(ITestimonies).save(newTestimony);

        return res.status(200).json({
            data: testimony,
            message: "Testimony retrieved",
        })
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: "Internal error",
        });
    }
}

const getTestimoniesController = async (req : Request, res :Response)=> {
    const schemaQuery : PropsTestimonies = { 
        page:Number(req.query.page!)-1  || 0 ,
        limit:Number(req.query.limit!) || 10
    }
    try {
       
        const [testimonies,totalTestimonies]  = await getRepository(ITestimonies).findAndCount({
            skip:schemaQuery.page!,
            take:schemaQuery.limit!
        }); 
        

        const data = testimonies.map((x)=> {
            return{
                id: x.id,
                title: x.title,
                content: x.content,
                tag: x.tag,
                status: x.status,
                created_by: x.created_by,
                created_at: x.created_at
            }});
            console.log(data);
        return res.status(200).json({
            data: data || [],
            pagination: {
              total: totalTestimonies,
              pages: Math.floor(calcNumberOfPages(schemaQuery.limit!, totalTestimonies)),
              results: testimonies.length,
              page: schemaQuery.page!,
              limit: schemaQuery.limit!, 
          },
          message: "Testimonies retrieved",
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: "Internal error",
        });
    }
}




export {
    postTestimoniesController,
    getTestimoniesController
}
