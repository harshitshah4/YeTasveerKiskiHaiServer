
var express = require('express');

var uniqid = require('uniqid');
const {body,validationResult} = require('express-validator');

var router = express.Router();

var media = require('../promises/prmMedia');
var post = require('../promises/prmPost');

var path = require('path')


router.get('/upload',(req,res)=>{
    const filename = req.query.filename;

    if(filename){

        const imageextensions = ['.jpg','.jpeg','.png'];

        const extension = path.extname(filename);
        
        if(imageextensions.includes(extension)){
            (
                async ()=>{
                    try{
                        
                        const mediaid = uniqid();
                        const mediaurl = "images/posts/"+mediaid+extension;

                        await media.insertMedia(mediaid,mediaurl,'image');
    
                        res.json(Object.assign({},await media.getSignedPost(mediaurl,'image',extension),{id:mediaid}));
                    
                    }catch(e){
                        console.log(e);
                        res.status(500).json({msg:"Something Went Wrong"});        
                    }
                }
            )();
            
        
        }else{
            res.status(500).json({msg:"Something Went Wrong"});
        }
        
    }else{
        res.status(500).json({msg:"Something Went Wrong"});
    }


})


router.post('/',
    body('posts').isArray({min:0,max:200})
,(req,res)=>{

    if(validationResult(req).isEmpty()){
        const posts = req.body.posts;

        (
            async ()=>{
                try{

                    var pids = [];

                    for(var i=0;i<posts.length;i++){
                        
                        const image = posts[i].image;
                        const label = posts[i].label;

                        if(await media.getMedia(image)){
                            const pid = uniqid();
                            await post.addPost({pid:pid,image:image,label:label});
                            pids.push(pid);
                        }else{
                            console.log("haha2")
                            res.status(500).json({msg:"Something Went Wrong"})
                        }
                    }

                    res.send(pids);
                }catch(e){
                    console.log("haha")
                    console.log(e)
                    res.status(500).json({msg:"Something Went Wrong"})
                }
            }
        )();

    }else{
        console.log("here")
        res.status(500).json({msg:"Something Went Wrong"});
    }

})


router.post('/edit',
    body('posts').isArray({min:0,max:200})
,(req,res)=>{

    if(validationResult(req).isEmpty()){    

        const posts = req.body.posts;

        (
            async ()=>{
                try{

                    var pids = []
                     
                    for(var i=0;i<posts.length;i++){
                        const pid = posts[i].pid;
                        const label = posts[i].label;
                        if(await post.getPost(pid)){
                            await post.updatePost(pid,{label:label});

                            pids.push(pid)
                        }
                    }

                    res.send(pids)
                }catch(e){
                    res.status(500).json({msg:"Something Went Wrong"});
                }
            }
        )();
        

    }else{
        res.status(500).json({msg:"Something Went Wrong"});
    }


})

module.exports = router;