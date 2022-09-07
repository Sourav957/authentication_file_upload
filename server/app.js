 const express = require('express');
 const app = express();
 const port = 8009;
 const connectDB = require('./db/connect');
 const router = require('./router/router');
 const cors = require('cors');
 const cookieParser = require('cookie-parser');

 //mongo url
 MONGO_URI = "mongodb+srv://Akash:akash957@cluster0.spiwtsm.mongodb.net/Authusers?retryWrites=true&w=majority"

 //middlewares
 app.use(express.json());
 app.use(cookieParser());
 app.use(cors());
 app.use(router);
 app.use('/uploads',express.static('./uploads'));     


 //database connection
 const start = async() => {
   try {
      await connectDB(MONGO_URI);
      await app.listen(port,() => {
        console.log(`server is listening on port ${port}`);
     })
   } catch (error) {
      console.log(error);
   }
  

 }

 start();
 