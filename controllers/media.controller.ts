import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { IMediaItems } from "../entity/media.entity";
import { url } from "inspector";
import { calcNumberOfPages } from '../helpers/generic';
import { getRepository } from "typeorm";
import {deleteFile, uploadFile} from "../helpers/uploadAWS.helper";
import dotenv from 'dotenv';
import { convertToBase64 } from '../helpers/base64';
dotenv.config()


interface PropsMedia {
  page: number;
  limit: number;
}
export interface IPropsImage{
  fieldname:string;
  originalname: string;
  encoding?:string;
  mimetype?:string;
  destination?:string;
  filename?:string;
  path?:string;
  size?:number;
}

const postMediaItemsController = async (req: Request, res: Response) => {

    try {
    if (!req.file) {
      return res.status(400).json({
        data: null,
        message: "Bad request, Image is required",
      });
    }
    const newFile:any = req.file!;
    const allowedFileType = ["image/png","image/jpg","image/jpeg"];

    if (!allowedFileType.includes(newFile.mimetype!)) {
      return res.status(400).json({
        data: null,
        message: "Bad request",
      });
    }
    

    const urlFileProvider = await uploadFile(   
      newFile,
      `media/${newFile.originalname}`,
      newFile.mimetype!,
      false
    );

    if (urlFileProvider == "") {
      return res.status(500).json({
        data: {},
        message: "Error uploading file to the provider",
      });
    }

    const item =  getRepository(IMediaItems).create({  
      name:newFile!.originalname!,
      description: req.body.description || "",
      type: newFile.mimetype,
      height: -1, 
      width: -1, 
      size: newFile.size,
      url: urlFileProvider,
    });
    const newMedia = await getRepository(IMediaItems).save(item);
    return res.status(200).json({
      data: {
        ...newMedia,
      },
      message: "File is added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      message: "Internal error",
    });
  }
};

const mediaItemsIdentifierController = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const subDomainSpaceEndpint = "bibleverses";

    const item = await getRepository(IMediaItems).findOne({
      where: {
        id: identifier
      }
    });

    if (!item) {
      return res.status(404).json({
        data: null,
        message: "File does not exists",
      });
    }
    const urlBase = `https://${subDomainSpaceEndpint}.${process.env.DO_SPACE_ENDPOINT}`;

    if (!item.url.includes(urlBase)) {
      return res.status(409).json({
        data: null,
        message: "File domain/pattern is not allowed",
      });
    }
    
    const key = ((url:any) => {
      const splitStr = url.split(`${urlBase}/`);
      url = splitStr[1];
      url = url.replace(/%20/g, " ");

      return url;
    })(item.url);

    await deleteFile(key);
    
    await getRepository(IMediaItems).delete({
      id: item.id
    });

    return res.status(200).json({
      data: {},
      message: "File is deleted",
    });
  } catch (error) {
    res.status(500).json({
      data: {},
      message: "Internal error",
    });
  }
};

const getMediaItemsController = async (req: Request, res: Response) => {
  const schemaQuery : PropsMedia = {
    page: Number(req.query.page!) - 1 || 0 ,
    limit:Number(req.query.limit!) || 10
}

  try {

    const [items,totalItems]  = await getRepository(IMediaItems).findAndCount({
      skip:schemaQuery.page,
      take:schemaQuery.limit
    });
    let data :any[]=[];
    for (const x of items) {
   
      data.push({
        id: x.id,
        name: x.name,
        description: x.description,
        type: x.type,
        height: x.height,
        width: x.width,
        size: x.size,
        url: x.url,
        created_at: x.created_at
      })
    }
       
    return res.status(200).json({
            data: data || [],
            pagination: {
                total: totalItems,
                pages: Math.floor(calcNumberOfPages(schemaQuery.limit, totalItems)),
                results: items.length,
                page: schemaQuery.page + 1,
                limit: schemaQuery.limit == -1 ? items.length: schemaQuery.limit 
            },

        message: "Media items retrieved",
    });
  } catch (error) {
    return res.status(500).json({
        data: null,
        message: "Internal error",
    });
  }
};

export {
  postMediaItemsController,
  mediaItemsIdentifierController,
  getMediaItemsController,
};
