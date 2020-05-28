var express = require('express');

var router = express.Router();


var post = require('../promises/prmPost');
var model = require('../promises/prmModel');
var media = require('../promises/prmMedia');

const { body , validationResult} = require('express-validator');


router.get('/',(req,res)=>{
    (
        async ()=>{
            try{
                res.send(await model.get())
            }catch(e){
                res.status(500).json({msg:"Something Went Wrong"})
            }
        }
    )();
})

router.post('/test',[
    body('pids').isArray({min:0,max:200})
],(req,res)=>{

    if(validationResult(req).isEmpty()){
        const pids = req.body.pids;
        (
            async ()=>{
                try{

                    res.json({msg:"Loading"})

                    await model.test(pids);



                }catch(e){
                    console.log("here")
                    console.log(e)
                    res.status(500).json({msg:"Something Went Wrong"})
                }
            }
        )();
    }else{
        console.log("here2")
        res.status(500).json({msg:"Something Went Wrong"});
    }
    
})


router.post('/train',[
    body('pids').isArray({min:0,max:200})
],(req,res)=>{
    if(validationResult(req).isEmpty()){
        const pids = req.body.pids;
        const parameters = req.body.model;
        (
            async ()=>{
                try{
                    res.json({msg:"Loading"});
                    await model.train(pids,parameters);
                }catch(e){
                    console.log("here")
                    console.log(e)
                    res.status(500).json({msg:"Something Went Wrong"})
                }
            }
        )();
    }else{
        console.log("here2")
        res.status(500).json({msg:"Something Went Wrong"});
    }
    
})

module.exports = router
