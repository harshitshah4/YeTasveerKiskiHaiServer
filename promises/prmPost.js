const db = require('./prmConnection').get();

module.exports = {
    addPost : ({pid,image,label})=>{
        return new Promise((resolve,reject)=>{
            db.collection("posts").insertOne({pid:pid,image:image,label:label},(err,result)=>{
                if(err){
                    reject();
                }else{
                    resolve();
                }
            })
        })
        
    },
    getPost:(pid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("posts").findOne({pid:pid},(err,result)=>{
                if(err){
                    reject();
                }else{
                    resolve(result);
                }
            })
        })
    },
    updatePost:(pid,{label})=>{
        return new Promise((resolve,reject)=>{
            db.collection("posts").updateOne({pid:pid},{$set:{label:label}},(err,result)=>{
                if(err){
                    reject();
                }else{
                    resolve();
                }
            })
        })
    }
}