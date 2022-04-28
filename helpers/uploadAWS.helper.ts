import AWS from 'aws-sdk';
import fs from 'fs';
import util from 'util';
import dotenv from 'dotenv';
import { IPropsImage } from '../controllers/media.controller';
dotenv.config()
const unlinkFile = util.promisify(fs.unlink);

//const sleep = require('sleep-promise');

const s3sourceCredentials = new AWS.Credentials({
  accessKeyId: process.env.DO_SPACE_ACCESS_KEY_ID!,
  secretAccessKey: process.env.DO_SPACE_SECRET_ACCESS_KEY!,
});

const s3 = new AWS.S3({
  credentials:s3sourceCredentials,
  endpoint: process.env.DO_SPACE_ENDPOINT,
  region: "us-east-1",
});

export const uploadFile = async (data:any, name:string, contentType:string, isPrivate = true) => {
  const fileStream = fs.createReadStream(data.path!);
  try {
    const privates = isPrivate ? "private" : "public-read";
    const params = {
      Bucket: process.env.DO_SPACE_SECRET_BUCKET_NAME,
      Key: name,
      Body: fileStream,
      ContentType: contentType,
      ACL: privates,
    };
    const s3Data :any = await uploadFileToAws(params);
    await unlinkFile(fileStream.path!);
    return s3Data.Location;
  } catch (err) {
    console.log('ERR uploadFile ', err);
    return "";
  }

};

export const uploadFileToAws = (params:any) => {
  return new Promise((resolve, reject) => {
    try {
      s3.upload(params, (err:any, data:any) => {
        if (err) {
          console.error("Error uploading data: ", err.message);
          reject(err.message);
        }
        resolve(data);
      });
    } catch (err:any) {
      console.error("Error in uploadFileToAws: ", err.message);
    }
  });
};

export const deleteFile = async (key:any) => {

  try {
    const params = {
      Bucket: process.env.DO_SPACE_SECRET_BUCKET_NAME,
      Key: key,
    };

    const s3Data = await deleteFileFromAws(params);

    console.log("s3Data::: ", s3Data);

    return s3Data;
  } catch (err) {
    console.log('ERR deleteFile ', err);
    return "";
  }
};

export const deleteFileFromAws = (params:any) => {
  return new Promise((resolve, reject) => {
    try {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error("Error deleting data: ", err.message);
          reject(err.message);
        }
        resolve(data);
      });
    } catch (err) {
      console.error("Error in deleteFileFromAws: ", err);
    }
  });
};
/*
const verifyExists = async (path, millisecondsLimit) => {

  let exists = false;
  const seconds = millisecondsLimit / 1000;

  for (let $i = 0; $i < seconds; $i++) {

    if (fs.existsSync(path)) {

      exists = true;
      break;

    }

    await sleep(1000);

  }

  return exists;
*/