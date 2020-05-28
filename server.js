(
    async ()=>{
        try{
            
            require('dotenv').config({});

            var mongo = require('./promises/prmConnection');

            await mongo.connect()

            var express = require('express');

            var router = express.Router();

            var cors = require('cors');

            router.use(express.urlencoded({extended:true}));
            router.use(express.json());
            router.use(cors())

            var post = require('./routes/post');

            var model = require('./routes/model');

            router.use('/post',post);
            router.use('/model',model);

            var app = express();
            var http = require('http').createServer(app);
            var io = require('socket.io')(http);

            // var mongoAdapter = require("socket.io-adapter-mongo");

            // io.adapter(mongoAdapter(process.env.DATABASE_URL))

            io.on('connection',(socket)=>{
                console.log("A user connected");

                socket.on('disconnect',()=>{
                    console.log("A user disconnected")
                })
            }) 

            


            const pPost = require('./promises/prmPost');
            const pMedia = require('./promises/prmMedia');

            router.post('/tested',(req,res)=>{
                (
                    async ()=>{
                        try{
                            
                            const posts = req.body;
                            console.log(posts);

                            var processedPosts = [];

                            for(var i=0;i<posts.length;i++){
                                const currentPost = posts[i];

                                const imageid = (await pPost.getPost(currentPost.pid)).image;

                                processedPosts.push(Object.assign({},{pid:currentPost.pid,image:await pMedia.getSignedUrl((await pMedia.getMedia(imageid) || {}).url),confidence:currentPost.confidence,label:currentPost.pred_class}))
                            }


                            io.emit("tested",{posts:processedPosts})
                            res.json({msg:"Success"});

                        }catch(e){
                            console.log(e);
                            res.status(500).json({msg:"Something Went Wrong"})
                        }
                    }
                )();
                

            })

            router.post('/trained',(req,res)=>{
                io.emit("trained",{msg:"Successfull"})
                res.json({msg:"Successfull"})
            })

            app.use('/',router);
            app.use('*',(req,res)=>{
                res.status(500).json({msg:"Something Went Wrong"});
            })

            http.listen(process.env.PORT , ()=>{
                console.log("Server Started");
            })


        }catch(e){
            console.log("Something Went Wrong")
            console.log(e)
        }
    }
)();