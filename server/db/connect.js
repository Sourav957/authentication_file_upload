const mongoose = require('mongoose');




const connectDB = (url) => {
    mongoose.connect(url,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    })
}

module.exports = connectDB;



