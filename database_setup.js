const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Teggoon:admin@cluster0-zplsz.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

var filler_acc = {username: "_", email: "_", password: "_"};
