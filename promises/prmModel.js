var axios = require('axios');

module.exports = {
    get:()=>{
        return new Promise((resolve,reject)=>{
            axios.get(process.env.MODEL_URL+"model")
                .then((res)=>{
                    resolve(res.data);
                })
                .catch((err)=>{
                    reject(err);
                })
        })
    },
    test : (pids)=>{
        return new Promise((resolve,reject)=>{
            axios.post(process.env.MODEL_URL+"test",{posts:pids})
                .then((res)=>{
                    resolve(res.data);
                })
                .catch((err)=>{
                    reject(err);
                })
        })
    },
    train : (pids,parameters)=>{
        return new Promise((resolve,reject)=>{
            axios.post(process.env.MODEL_URL+"train",{posts:pids,parameters:parameters})
                .then((res)=>{
                    resolve();
                })
                .catch((err)=>{
                    reject(err);
                })
        })
    }
}