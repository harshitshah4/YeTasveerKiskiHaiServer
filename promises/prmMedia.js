const CLOUDFRONT_PRIVATE_KEY = REPLACE_WITH_CLOUDFRON_PRIVATE_KEY



const AWS = require('aws-sdk');

const AWS_REGION = process.env.AWS_REGION;

const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;
const CLOUDFRONT_ACCESS_KEY_ID = process.env.CLOUDFRONT_ACCESS_KEY_ID;

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_ACCESS_KEY_SECRET = process.env.S3_ACCESS_KEY_SECRET;


AWS.config.region = AWS_REGION;


const cloudfrontSigner = new AWS.CloudFront.Signer(CLOUDFRONT_ACCESS_KEY_ID,CLOUDFRONT_PRIVATE_KEY);
const s3 = new AWS.S3({accessKeyId:S3_ACCESS_KEY_ID,secretAccessKey:S3_ACCESS_KEY_SECRET,signatureVersion:'v4'});


const db = require('./prmConnection').get();

module.exports={
    getSignedUrl : (url)=>{
        return new Promise((resolve,reject)=>{
            cloudfrontSigner.getSignedUrl({url : CLOUDFRONT_URL+url,expires:Date.now()+5*60*1000},(err,url)=>{
                    if(err){
                        reject()
                    }else{
                        resolve(url);
                    }
                })
            })
        } ,
    getSignedPost : (key,mediatype,mediaext)=>{
            return new Promise((resolve,reject)=>{
                const params={
                    Bucket:S3_BUCKET_NAME,
                    Fields:{
                        key:key,
                        'Content-Disposition' : 'inline',
                        'Content-Type' : mediatype+"/"+mediaext.split(".")[1]
                    },
                    Conditions:[
                            //["content-length-range",1, 10485760]
                    ]
                }
    
                s3.createPresignedPost(params,(err,data)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(data);
                    }
                })
            })
        },
        insertMedia : (mediaid,mediaurl,mediatype)=>{
            return new Promise((resolve,reject)=>{
                db.collection('media').insertOne({id:mediaid,url:mediaurl,type:mediatype,timestamp:Date.now()},(err,result)=>{
                    if(err){
                        reject();
                    }else{
                        resolve();
                    }
                })

            })
        },
        getMedia : (mediaid)=>{
            return new Promise((resolve,reject)=>{
                db.collection("media").findOne({id:mediaid},(err,result)=>{
                    if(err){
                        reject();
                    }else{
                        resolve(result);
                    }
                })
            })
        }

}