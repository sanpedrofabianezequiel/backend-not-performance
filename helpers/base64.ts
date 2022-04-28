import axios from 'axios';

export const convertToBase64=async(url:string)=>{
    if(url == null || url == undefined){
        return '';
    }
    let image = await axios.get(url, {responseType: 'arraybuffer'});
    let raw = Buffer.from(image.data).toString('base64');
    return "data:" + image.headers["content-type"] + ";base64,"+raw;
}
