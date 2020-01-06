const port = process.env.PORT || 3000;
//var mongodburl="mongodb://localhost:27017/email";

var mongodburl="mongodb+srv://admin:harishht@654@cluster0-nprca.mongodb.net/emailDB?retryWrites=true&w=majority";

module.exports={
    port:port,
    mongodburl:mongodburl
}